-- Some real cover photos are public domain (no attribution needed, e.g.
-- U.S. federal mugshots/press photos), but others are only usable under a
-- Creative Commons Attribution license, which legally requires crediting
-- the photographer wherever the image is shown. Rather than skip every
-- CC-BY photo, store the required credit line alongside the image.
ALTER TABLE articles ADD COLUMN cover_image_credit VARCHAR(255);
