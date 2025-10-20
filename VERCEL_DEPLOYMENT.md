# 🚀 Deployment a Vercel - JoltCab Frontend

## ✅ Pre-requisitos Completados

- ✅ Repositorio en GitHub: https://github.com/joltcab/frontend
- ✅ Configuración de build lista (`vite.config.js`, `vercel.json`)
- ✅ Variables de entorno configuradas (`.env.production`)

---

## 📋 Pasos para Deployar

### 1️⃣ Conectar Vercel con GitHub

1. Ve a https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Importa el repositorio `joltcab/frontend`
4. Autoriza acceso a GitHub si es necesario

---

### 2️⃣ Configurar el Proyecto

Vercel detectará automáticamente Vite. Verifica estos valores:

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
./
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

---

### 3️⃣ Configurar Variables de Entorno

En **Environment Variables**, agrega:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://admin.joltcab.com` | Production, Preview, Development |
| `VITE_NODE_ENV` | `production` | Production |

**Opcional (cuando estén listos):**
- `VITE_FIREBASE_API_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`

---

### 4️⃣ Deploy

1. Click **"Deploy"**
2. Espera a que el build termine (~2-3 minutos)
3. Tu app estará disponible en: `https://[tu-proyecto].vercel.app`

---

### 5️⃣ Conectar Dominio Personalizado

#### En Vercel:

1. Ve a **Project Settings** → **Domains**
2. Click **"Add"**
3. Ingresa: `joltcab.com`
4. Click **"Add"**
5. Repite para: `www.joltcab.com`

Vercel te mostrará los registros DNS necesarios:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

#### En Cloudflare DNS:

1. Ve a **Cloudflare Dashboard** → **DNS**
2. Agrega/Actualiza estos registros:

**Para joltcab.com (raíz):**
- Type: `CNAME`
- Name: `@`
- Target: `cname.vercel-dns.com`
- Proxy status: ☁️ Proxied (naranja)

**Para www.joltcab.com:**
- Type: `CNAME`
- Name: `www`
- Target: `cname.vercel-dns.com`
- Proxy status: ☁️ Proxied (naranja)

3. Click **"Save"**

**Espera:** 5-10 minutos para que se propague el DNS.

---

### 6️⃣ Verificar SSL/HTTPS

Vercel automáticamente provee certificados SSL. Una vez que el DNS se propague:

- ✅ `https://joltcab.com` → Funcionará
- ✅ `https://www.joltcab.com` → Funcionará
- ✅ Auto-redirect HTTP → HTTPS

---

## 🔧 Configuración Avanzada (Opcional)

### Redirects automáticos:

Vercel ya está configurado con `vercel.json` para:
- ✅ SPA routing (todas las rutas → index.html)
- ✅ Cache optimizado para assets
- ✅ Gzip/Brotli compression automática

### Continuous Deployment:

✅ **Ya activado automáticamente:**
- Cada push a `main` → Deploy automático a producción
- Cada PR → Preview deployment automático
- Rollback instantáneo desde dashboard

---

## 🧪 Testing Post-Deployment

Una vez deployado, verifica:

1. **Landing Page**: https://joltcab.com/
2. **Login**: https://joltcab.com/login
3. **Register**: https://joltcab.com/register
4. **Admin**: https://joltcab.com/admin

**Verifica la consola del navegador:**
- ✅ Sin errores CORS (si el backend ya está deployado en `admin.joltcab.com`)
- ✅ API calls conectándose a `https://admin.joltcab.com`

---

## 📊 Monitoreo

Vercel provee:
- 📈 Analytics (visitas, performance)
- 🐛 Error logging (runtime errors)
- 📡 Deployment logs (build logs)

Accede desde: https://vercel.com/dashboard

---

## 🔄 Actualizaciones Futuras

Para hacer cambios al frontend:

```bash
# 1. Hacer cambios en el código
# 2. Commit y push a GitHub
git add .
git commit -m "Update feature X"
git push origin main

# 3. Vercel deployrá automáticamente (30-60 segundos)
```

---

## ⚠️ Troubleshooting

**Error: Build failed**
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Vercel

**Error: 404 en rutas**
- `vercel.json` ya está configurado para manejar SPA routing

**Error: Can't connect to API**
- Verifica que `VITE_API_URL` esté configurado en Vercel
- Verifica CORS en el backend

---

## 🎯 Arquitectura Final

```
joltcab.com (Vercel)
    ↓
React App (Static)
    ↓
API Calls → admin.joltcab.com (Replit Backend)
    ↓
MongoDB + PostgreSQL + Redis
```

---

**¡Listo para deployar a Vercel! 🚀**
