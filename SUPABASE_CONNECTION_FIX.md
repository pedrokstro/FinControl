# Solucao para Erro de Conexao IPv6 no Render

## Problema
O Render esta tentando conectar ao Supabase via IPv6, causando erro ENETUNREACH.

## Solucao 1: Usar Connection Pooler do Supabase (RECOMENDADO)

O Supabase oferece um pooler de conexoes que funciona melhor com plataformas como Render.

### Passos:

1. Acesse: https://supabase.com/dashboard/project/hzazlkgpamawlqmvxyii/settings/database

2. Procure por "Connection Pooling" ou "Connection String"

3. Copie a "Connection String" do tipo **"Transaction Mode"** ou **"Session Mode"**

4. A URL deve ser algo como:
   ```
   postgresql://postgres.hzazlkgpamawlqmvxyii:360106@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   
   Ou:
   ```
   postgresql://postgres:360106@db.hzazlkgpamawlqmvxyii.supabase.co:6543/postgres
   ```

5. Use essa URL no Render como DATABASE_URL

### Diferencas:
- Porta **6543** (pooler) em vez de **5432** (direto)
- Pode ter subdominio diferente (pooler.supabase.com)
- Melhor compatibilidade com IPv4

## Solucao 2: Usar Supabase Direct Connection com pgBouncer

Se o Supabase oferece pgBouncer:

```
postgresql://postgres:360106@db.hzazlkgpamawlqmvxyii.supabase.co:6543/postgres?pgbouncer=true
```

## Solucao 3: Adicionar parametros de conexao

Tente adicionar estes parametros na DATABASE_URL:

```
postgresql://postgres:360106@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres?sslmode=require&connect_timeout=10&application_name=fincontrol
```

## Solucao 4: Verificar no Dashboard do Supabase

1. Va em: Settings > Database
2. Procure por "Connection Info" ou "Connection Pooling"
3. Copie a string de conexao para "External connections"
4. Pode haver opcoes para IPv4 especificamente

## Para Testar

Apos atualizar a DATABASE_URL no Render:
1. Va em "Manual Deploy"
2. Selecione "Clear build cache & deploy"
3. Monitore os logs

## Alternativa: Usar outro servico de banco

Se o problema persistir, considere:
- Railway (tem PostgreSQL nativo)
- Neon (PostgreSQL serverless)
- Supabase com IP fixo (plano pago)
