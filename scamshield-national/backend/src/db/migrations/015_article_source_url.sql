-- Some notorious profiles have no rights-cleared photo available at all
-- (e.g. a figure who died before any photo was ever digitized and
-- properly licensed). Rather than force a photo or leave the reader with
-- nothing, let an admin link out to a real news story covering the case.
ALTER TABLE articles ADD COLUMN source_url VARCHAR(500);
