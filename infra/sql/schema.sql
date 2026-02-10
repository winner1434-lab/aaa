CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  totp_secret TEXT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'AM')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
);

CREATE TABLE user_properties (
  user_id INT REFERENCES users(id),
  property_id INT REFERENCES properties(id),
  PRIMARY KEY (user_id, property_id)
);

CREATE TABLE room_types (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id),
  name VARCHAR(120) NOT NULL,
  base_rate NUMERIC(10,2) NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  venue VARCHAR(255) NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  impact_level VARCHAR(20) NOT NULL,
  source VARCHAR(80) NOT NULL,
  source_url TEXT,
  raw_data JSONB,
  crawled_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE rates (
  id SERIAL PRIMARY KEY,
  room_type_id INT NOT NULL REFERENCES room_types(id),
  date DATE NOT NULL,
  original_rate NUMERIC(10,2) NOT NULL,
  final_rate NUMERIC(10,2) NOT NULL,
  rate_source VARCHAR(30) NOT NULL,
  status VARCHAR(20) NOT NULL,
  UNIQUE (room_type_id, date)
);

CREATE TABLE rules (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id),
  rule_type VARCHAR(50) NOT NULL,
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  priority INT NOT NULL DEFAULT 100
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(80) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
