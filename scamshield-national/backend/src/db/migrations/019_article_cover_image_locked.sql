-- Manual cover-photo edits made through the Admin panel were silently
-- reverted by the next automatic `npm run seed` run, since the upsert
-- always preferred seed.ts's value whenever it had one set. This flag
-- marks a photo as manually curated so seeding leaves it alone; only a
-- direct Admin edit sets it (see articles controller's update handler).
ALTER TABLE articles ADD COLUMN cover_image_locked BOOLEAN NOT NULL DEFAULT false;
