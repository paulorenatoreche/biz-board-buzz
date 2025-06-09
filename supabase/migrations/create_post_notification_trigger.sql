
-- Criar a função que chama a Edge Function
CREATE OR REPLACE FUNCTION notify_new_post()
RETURNS TRIGGER AS $$
BEGIN
  -- Chama a Edge Function quando um novo post é inserido
  PERFORM
    net.http_post(
      url := 'https://imntrqfsmcbsbtpjndmm.supabase.co/functions/v1/notify-new-post',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbnRycWZzbWNic2J0cGpuZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODcwMzYsImV4cCI6MjA2NTA2MzAzNn0.F8eOCYqyuSE2-uF922sahUiaaNDKDn6JLSupmwJ55es"}',
      body := json_build_object('record', row_to_json(NEW))::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS trigger_notify_new_post ON posts;

-- Criar o trigger que executa a função após inserir um post
CREATE TRIGGER trigger_notify_new_post
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_post();
