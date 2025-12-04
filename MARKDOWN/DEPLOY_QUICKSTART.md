# ⚡ Deploy Rápido - 5 Minutos

## 🎯 **Passo 1: Adicionar Secrets no GitHub (2 min)**

1. Vá para: https://github.com/SEU-USUARIO/SEU-REPO/settings/secrets/actions
2. Clique em **"New repository secret"**
3. Adicione estes 2 secrets:

```
Nome: JWT_SECRET
Valor: b86ff1b94e80750346361dba0319aeceb9e79e46fc0a3c0bbdf7c7b43f4acc5f3511b5f46ffe43e9cdef718cac08c495ab04df2fbc01dca0045be4a2ffb3162c

Nome: JWT_REFRESH_SECRET  
Valor: f2321947a15557e55100affb09ab7dfcffac20aa545e768bb37b07150dbc44aafd9feeca3c396947d14c6a5b20e741e9880dcae1ae6a5f053a712b440c8629d0
```

---

## 🚀 **Passo 2: Deploy do Backend no Render (2 min)**

1. Acesse: https://render.com/
2. Clique em **"New +"** → **"Web Service"**
3. Conecte ao GitHub e selecione seu repositório
4. Configure:
   - **Name:** `fincontrol-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

5. Adicione estas variáveis de ambiente:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<copiar do GitHub Secret>
   JWT_SECRET=<copiar acima>
   JWT_REFRESH_SECRET=<copiar acima>
   CORS_ORIGIN=*
   ```

6. Clique em **"Create Web Service"**
7. **Copie a URL** (ex: `https://fincontrol-backend.onrender.com`)

---

## 🌐 **Passo 3: Deploy do Frontend na Vercel (1 min)**

1. Acesse: https://vercel.com/new
2. Importe seu repositório do GitHub
3. Configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Adicione variável de ambiente:
   ```
   VITE_API_URL=https://fincontrol-backend.onrender.com/api/v1
   ```

5. Clique em **"Deploy"**
6. Aguarde ~1 minuto
7. **Copie a URL** (ex: `https://fincontrol.vercel.app`)

---

## 🔄 **Passo 4: Atualizar CORS no Backend**

1. Volte no Render (backend)
2. Vá em **"Environment"**
3. Edite `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://fincontrol.vercel.app
   ```
4. Salve (vai fazer redeploy automático)

---

## ✅ **Passo 5: Testar!**

1. Acesse seu app: `https://fincontrol.vercel.app`
2. Tente fazer login com:
   - Email: `demo@financeiro.com`
   - Senha: `Demo123!@#`

3. Se funcionar: **🎉 DEPLOY COMPLETO!**

---

## 🆘 **Problemas?**

### **Erro: CORS**
- Verifique se `CORS_ORIGIN` no backend tem a URL correta do frontend

### **Erro: 500 Internal Server Error**
- Verifique os logs no Render: Dashboard → Logs
- Confirme se `DATABASE_URL` está correto

### **Erro: Cannot connect to database**
- Verifique se o IP do Render está na whitelist do Supabase
- Supabase → Settings → Database → Connection Pooling

---

## 📊 **URLs Importantes**

- **Frontend:** https://fincontrol.vercel.app
- **Backend:** https://fincontrol-backend.onrender.com
- **API Docs:** https://fincontrol-backend.onrender.com/api-docs
- **Health Check:** https://fincontrol-backend.onrender.com/health

---

**Tempo total:** ~5 minutos ⚡
