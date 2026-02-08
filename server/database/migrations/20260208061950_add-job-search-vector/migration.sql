CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION f_normalize(text) RETURNS text
AS $$
  SELECT public.unaccent(
    'public.unaccent', 
    lower(
      regexp_replace($1, '\s+', ' ', 'g')
    )
  );
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;

-- CREATE OR REPLACE FUNCTION immutable_normalize(text)
-- AS $$
--   SELECT trim(
--     regexp_replace(
--       lower(
--         SELECT public.unaccent('public.unaccent', $1);
--       ),
--       '\s+',
--       ' ',
--       'g'
--     )
--   )
-- $$ RETURNS text
-- LANGUAGE sql
-- IMMUTABLE;