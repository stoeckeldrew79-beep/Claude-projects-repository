-- "Check This Now" needs full-text search over name+description, not just
-- name — but computing to_tsvector('english', description) from raw text
-- on every row, on every request, with no index, measured at 10+ seconds
-- per search against the current ~4,500-row table. A generated column
-- computes it once, at write time, and the GIN index makes @@ lookups
-- against it cheap regardless of table size, the same reasoning as
-- idx_scams_tags above.
ALTER TABLE scams ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED;

CREATE INDEX idx_scams_search_vector ON scams USING GIN (search_vector);
