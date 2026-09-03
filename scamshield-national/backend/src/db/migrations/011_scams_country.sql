-- Additive support for international coverage: every scam record now
-- carries a country (ISO 3166-1 alpha-2), defaulting to US to match
-- existing data. This is the data-model groundwork only — the site's
-- name, copy, and legal framing (TCPA/CAN-SPAM references) are still
-- US-specific and stay out of scope here.
ALTER TABLE scams ADD COLUMN country VARCHAR(2) DEFAULT 'US';
CREATE INDEX idx_scams_country ON scams(country);
