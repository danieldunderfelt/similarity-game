-- Create a function to generate a match with two random texts
CREATE OR REPLACE FUNCTION create_random_match()
RETURNS uuid
LANGUAGE plpgsql
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
