CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  body TEXT NOT NULL,
  author VARCHAR(100),
  cover_image VARCHAR(500),
  tags TEXT[],
  scam_id UUID REFERENCES scams(id),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_scam ON articles(scam_id);
CREATE INDEX idx_articles_published ON articles(published);
