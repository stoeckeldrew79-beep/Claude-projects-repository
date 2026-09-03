-- Rights-cleared photos vary wildly in composition (headshots, group
-- photos, award-ceremony candids), so a single fixed crop doesn't work
-- for all of them. This stores a vertical focal point (0 = top of image,
-- 100 = bottom, 50 = center) so each photo's crop can be tuned per-article
-- instead of via a shared CSS class.
ALTER TABLE articles ADD COLUMN cover_image_position SMALLINT NOT NULL DEFAULT 50;
