
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    console.log('New post created:', record)
    
    // Configure seu email aqui
    const notificationEmail = 'seu-email@gmail.com' // ALTERE PARA SEU EMAIL
    
    if (!RESEND_API_KEY) {
      console.log('RESEND_API_KEY não configurado, apenas logando o post')
      return new Response(
        JSON.stringify({ 
          message: 'Post criado mas email não enviado (API key não configurada)',
          post: record 
        }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    // Enviar email usando Resend (gratuito até 3000 emails/mês)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com', // Configure um domínio verificado no Resend
        to: [notificationEmail],
        subject: `Novo post criado: ${record.company_name}`,
        html: `
          <h2>Novo post no Hub de Negócios!</h2>
          <p><strong>Empresa:</strong> ${record.company_name}</p>
          <p><strong>Nome:</strong> ${record.full_name}</p>
          <p><strong>Categoria:</strong> ${record.category_label}</p>
          <p><strong>Descrição:</strong> ${record.description}</p>
          <p><strong>Email:</strong> ${record.email}</p>
          <p><strong>Telefone:</strong> ${record.phone}</p>
          <p><strong>Criado em:</strong> ${new Date(record.created_at).toLocaleString('pt-BR')}</p>
        `,
      }),
    })

    if (emailResponse.ok) {
      console.log('Email enviado com sucesso')
      return new Response(
        JSON.stringify({ message: 'Notificação enviada com sucesso' }),
        { headers: { "Content-Type": "application/json" } }
      )
    } else {
      const error = await emailResponse.text()
      console.error('Erro ao enviar email:', error)
      return new Response(
        JSON.stringify({ message: 'Erro ao enviar email', error }),
        { headers: { "Content-Type": "application/json" } }
      )
    }
  } catch (error) {
    console.error('Erro na Edge Function:', error)
    return new Response(
      JSON.stringify({ message: 'Erro interno', error: error.message }),
      { headers: { "Content-Type": "application/json" } }
    )
  }
})
```

Agora vou criar o arquivo SQL para configurar o trigger no banco de dados:

<lov-write file_path="supabase/migrations/create_post_notification_trigger.sql">
-- Criar a função que chama a Edge Function
CREATE OR REPLACE FUNCTION notify_new_post()
RETURNS TRIGGER AS $$
BEGIN
  -- Chama a Edge Function quando um novo post é inserido
  PERFORM
    net.http_post(
      url := 'https://imntrqfsmcbsbtpjndmm.supabase.co/functions/v1/notify-new-post',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbnRycWZzbWNic2J0cGpuZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODcwMzYsImV4cCI6MjA2NTA2MzAzNn0.F8eOCYqyuSE2-uF922sahUiaaNDKDn6JLSupmwJ55es"}'::jsonb,
      body := json_build_object('record', row_to_json(NEW))::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger que executa a função após inserir um post
DROP TRIGGER IF EXISTS trigger_notify_new_post ON posts;
CREATE TRIGGER trigger_notify_new_post
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_post();
```

Agora vou criar as instruções de configuração:

<lov-write file_path="CONFIGURAR_NOTIFICACOES.md">
# Configuração de Notificações por Email - GRATUITO

## Passos para configurar:

### 1. Deploy da Edge Function
No painel do Supabase:
1. Vá em **Edge Functions**
2. Clique em **Create Function**
3. Nome: `notify-new-post`
4. Cole o código do arquivo `supabase/functions/notify-new-post/index.ts`
5. Clique em **Deploy**

### 2. Configurar o Trigger no Banco
No painel do Supabase:
1. Vá em **SQL Editor**
2. Cole e execute o código do arquivo `supabase/migrations/create_post_notification_trigger.sql`

### 3. Configurar Email (Opcional - para emails reais)
Para enviar emails reais (senão só vai logar no console):

1. **Crie conta gratuita no Resend**: https://resend.com (3.000 emails grátis/mês)
2. **Configure domínio** ou use domínio de teste
3. **Copie sua API Key**
4. No Supabase, vá em **Settings > Environment Variables**
5. Adicione: `RESEND_API_KEY` = sua_api_key
6. **Edite o arquivo da Edge Function**:
   - Linha 8: Altere `'seu-email@gmail.com'` para seu email real
   - Linha 24: Altere `'noreply@yourdomain.com'` para um email verificado no Resend

### 4. Testar
1. Crie um post no sistema
2. Verifique os logs da Edge Function no painel do Supabase
3. Se configurou o Resend, verifique seu email

## Como funciona:
- ✅ **100% Gratuito** (Supabase + Resend free tier)
- ✅ **Automático** - notifica assim que post é criado
- ✅ **Sem código adicional** no frontend
- ✅ **Logs completos** no Supabase para debug

## Alternativa sem email:
Se não quiser configurar email, a Edge Function vai apenas logar as informações do post no console do Supabase, que você pode verificar em **Edge Functions > Logs**.
```

