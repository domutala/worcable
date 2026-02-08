-- Custom SQL migration file, put your code below! --

CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION immutable_normalize(text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(
           regexp_replace(
             lower(unaccent($1)),
             '\s+',
             ' ',
             'g'
           )
         )
$$;

ALTER TABLE job
ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(
        to_tsvector(
            'simple',
            immutable_unaccent (coalesce(title, ''))
        ),
        'A'
    ) || setweight(
        to_tsvector(
            'simple',
            immutable_unaccent (coalesce(job_description, ''))
        ),
        'B'
    ) || setweight(
        to_tsvector(
            'simple',
            immutable_unaccent (
                coalesce(candidate_profile, '')
            )
        ),
        'C'
    )
) STORED;

CREATE INDEX IF NOT EXISTS job_search_vector_idx ON job USING GIN (search_vector);