
-- Create helper functions for common database operations like counters

-- Function to check if another function exists
CREATE OR REPLACE FUNCTION public.function_exists(function_name TEXT)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = function_name
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  );
END;
$$;

-- Function to enable realtime for a table
CREATE OR REPLACE FUNCTION public.enable_realtime(table_name TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format('ALTER TABLE public.%I replica identity full;', table_name);
  
  -- Add the table to the supabase_realtime publication
  EXECUTE format(
    'ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;',
    table_name
  );
END;
$$;

-- Function to increment a counter in any row and column
CREATE OR REPLACE FUNCTION public.increment_counter(row_id UUID, column_name TEXT)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_value integer;
  sql_statement text;
BEGIN
  sql_statement := format(
    'UPDATE public.quotes 
     SET %I = COALESCE(%I, 0) + 1 
     WHERE id = %L
     RETURNING %I;',
    column_name, column_name, row_id, column_name
  );
  
  EXECUTE sql_statement INTO new_value;
  RETURN new_value;
END;
$$;

-- Function to decrement a counter in any row and column with a minimum of 0
CREATE OR REPLACE FUNCTION public.decrement_counter(row_id UUID, column_name TEXT)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_value integer;
  sql_statement text;
BEGIN
  sql_statement := format(
    'UPDATE public.quotes 
     SET %I = GREATEST(0, COALESCE(%I, 0) - 1)
     WHERE id = %L
     RETURNING %I;',
    column_name, column_name, row_id, column_name
  );
  
  EXECUTE sql_statement INTO new_value;
  RETURN new_value;
END;
$$;

-- Enable realtime for the tables we need
SELECT enable_realtime('user_activities');
SELECT enable_realtime('quote_comments');
