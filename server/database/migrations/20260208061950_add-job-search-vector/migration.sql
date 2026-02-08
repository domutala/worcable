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