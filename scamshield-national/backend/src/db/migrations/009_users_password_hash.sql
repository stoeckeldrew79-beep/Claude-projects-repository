-- The dev-mode auth stub (auth.ts) previously issued a valid session for
-- any request bearing a known/registered email, with no secret check at
-- all. This adds real password storage so that stub is at least a
-- legitimate (if minimal) auth mechanism rather than a bypass.
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
