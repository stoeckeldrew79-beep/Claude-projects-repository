-- Victim-targeting labels for scams (elder, veteran, child-teen,
-- small-business, student, servicemember...). Deliberately tags rather than
-- categories: a category answers "what is this scam" and a scam has exactly
-- one, while "who is it aimed at" is a separate axis and a scam can carry
-- several — a solar-panel scam aimed at seniors is both home-improvement and
-- elder-targeted. Forcing that onto the category axis would mean picking one
-- and losing the other.
ALTER TABLE scams ADD COLUMN tags TEXT[];

-- GIN so "every scam tagged elder-targeted" stays cheap as the table grows.
CREATE INDEX idx_scams_tags ON scams USING GIN (tags);
