-- Create a function to generate a match with two random texts
CREATE OR REPLACE FUNCTION create_random_match()
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  text_1_id uuid;
  text_2_id uuid;
  match_id uuid;
BEGIN
  -- Get two random texts that are not deleted
  -- First text
  SELECT id INTO text_1_id
  FROM texts
  WHERE deleted_at IS NULL
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- Second text (ensuring it's different from the first)
  SELECT id INTO text_2_id
  FROM texts
  WHERE deleted_at IS NULL
    AND id != text_1_id
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- Insert a new match with the two random texts
  INSERT INTO matches (text_1, text_2)
  VALUES (text_1_id, text_2_id)
  RETURNING id INTO match_id;
  
  RETURN match_id;
END;
$$;

-- Add checkout columns to matches table
ALTER TABLE matches 
  ADD COLUMN checkout_at TIMESTAMPTZ,
  ADD COLUMN checkout_session_id TEXT;

-- Update the result column to ensure it can store numbers with high precision
ALTER TABLE matches 
  ALTER COLUMN result TYPE DECIMAL(10, 6);

-- Function to get or create a match with checkout
CREATE OR REPLACE FUNCTION get_or_create_match(session_id TEXT)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  available_match_id uuid;
  new_match_id uuid;
BEGIN
  -- First, try to find a match without a result that is either:
  -- 1. Never checked out
  -- 2. Checked out but expired (more than 5 minutes ago)
  SELECT id INTO available_match_id
  FROM matches
  WHERE 
    result IS NULL AND
    (
      checkout_at IS NULL OR
      checkout_at < NOW() - INTERVAL '5 minutes'
    )
  ORDER BY created_at
  LIMIT 1;
  
  -- If an available match is found, check it out
  IF available_match_id IS NOT NULL THEN
    UPDATE matches
    SET 
      checkout_at = NOW(),
      checkout_session_id = session_id
    WHERE id = available_match_id;
    
    RETURN available_match_id;
  END IF;
  
  -- If no available match is found, create a new one
  new_match_id := create_random_match();
  
  -- Check out the newly created match
  UPDATE matches
  SET 
    checkout_at = NOW(),
    checkout_session_id = session_id
  WHERE id = new_match_id;
  
  RETURN new_match_id;
END;
$$;


-- Enable Row Level Security on tables
ALTER TABLE texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- RLS policy for texts: allow read-only access to anyone
CREATE POLICY "Texts are readable by anyone" ON texts
  FOR SELECT
  TO public
  USING (true);

-- RLS policies for matches: allow select, insert, and update but not delete
CREATE POLICY "Matches can be viewed by anyone" ON matches
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Matches can be created by anyone" ON matches
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Matches can be updated by anyone" ON matches
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
