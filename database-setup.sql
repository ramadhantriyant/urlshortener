-- URL Shortener Database Setup
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- URLs table
CREATE TABLE urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_code VARCHAR(16) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clicks table for analytics
CREATE TABLE clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
  user_agent TEXT,
  referer TEXT,
  ip_address INET,
  country VARCHAR(2),
  city VARCHAR(100),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (optional)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  plan VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_urls_short_code ON urls(short_code);
CREATE INDEX idx_urls_user_id ON urls(user_id);
CREATE INDEX idx_urls_created_at ON urls(created_at);
CREATE INDEX idx_clicks_url_id ON clicks(url_id);
CREATE INDEX idx_clicks_clicked_at ON clicks(clicked_at);

-- Enable Row Level Security
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for URLs
CREATE POLICY "Users can view their own URLs" ON urls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own URLs" ON urls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own URLs" ON urls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own URLs" ON urls FOR DELETE USING (auth.uid() = user_id);

-- Public read access for URL resolution (anonymous users can access short URLs)
CREATE POLICY "Anyone can read active URLs for redirection" ON urls FOR SELECT USING (is_active = true);

-- RLS Policies for Clicks
CREATE POLICY "Anyone can insert clicks" ON clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view clicks for their URLs" ON clicks FOR SELECT
  USING (url_id IN (SELECT id FROM urls WHERE user_id = auth.uid()));

-- RLS Policies for User Profiles
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Function to atomically increment click counter
CREATE OR REPLACE FUNCTION increment_clicks(url_id UUID)
RETURNS void AS $$
BEGIN
  -- Update the denormalized counter based on actual clicks table count
  UPDATE urls
  SET clicks = (
    SELECT COUNT(*)
    FROM clicks
    WHERE clicks.url_id = increment_clicks.url_id
  )
  WHERE id = increment_clicks.url_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update urls.clicks when clicks are inserted
CREATE OR REPLACE FUNCTION update_url_clicks_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE urls
  SET clicks = (
    SELECT COUNT(*)
    FROM clicks
    WHERE url_id = NEW.url_id
  )
  WHERE id = NEW.url_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_urls_updated_at BEFORE UPDATE ON urls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update urls.clicks when clicks are inserted
CREATE TRIGGER trigger_update_url_clicks
  AFTER INSERT ON clicks
  FOR EACH ROW
  EXECUTE FUNCTION update_url_clicks_count();