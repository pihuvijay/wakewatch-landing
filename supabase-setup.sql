-- Create email_signups table for collecting email addresses
CREATE TABLE email_signups (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'landing_page'
);

-- Enable Row Level Security (RLS)
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for signup form)
CREATE POLICY "Allow email signup inserts" ON email_signups
  FOR INSERT WITH CHECK (true);

-- Create policy to allow admins to read all emails
CREATE POLICY "Allow admin read access" ON email_signups
  FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Create an index on email for faster lookups
CREATE INDEX idx_email_signups_email ON email_signups(email);
CREATE INDEX idx_email_signups_created_at ON email_signups(created_at);
