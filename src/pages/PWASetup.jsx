import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, Copy, CheckCircle, Download, Code, 
  FileCode, Image, Settings, Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function PWASetup() {
  const [copiedSteps, setCopiedSteps] = useState({});

  const copyToClipboard = (text, stepId) => {
    navigator.clipboard.writeText(text);
    setCopiedSteps({ ...copiedSteps, [stepId]: true });
    setTimeout(() => {
      setCopiedSteps({ ...copiedSteps, [stepId]: false });
    }, 2000);
  };

  const manifestJson = `{
  "name": "JoltCab",
  "short_name": "JoltCab",
  "description": "Ride-hailing with transparent pricing",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#15B46A",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["travel", "transportation"],
  "lang": "en-US"
}`;

  const serviceWorkerJs = `// Service Worker para JoltCab PWA
const CACHE_NAME = 'joltcab-v1';
const RUNTIME_CACHE = 'joltcab-runtime';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  if (event.request.url.includes('/api/') || event.request.url.includes('/functions/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return caches.open(RUNTIME_CACHE).then((cache) => {
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    })
  );
});

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.message || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'JoltCab', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});`;

  const indexHtmlMetaTags = `<!-- Agregar dentro de <head> en index.html -->
<meta name="theme-color" content="#15B46A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="JoltCab">
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Configuración PWA</h1>
              <p className="text-white/90 text-lg">Progressive Web App Setup</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <Zap className="w-6 h-6 mb-2" />
              <p className="font-semibold">Instalable</p>
              <p className="text-sm text-white/80">Como app nativa</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <Download className="w-6 h-6 mb-2" />
              <p className="font-semibold">Offline</p>
              <p className="text-sm text-white/80">Funciona sin internet</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <Settings className="w-6 h-6 mb-2" />
              <p className="font-semibold">5 Pasos</p>
              <p className="text-sm text-white/80">Configuración rápida</p>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-6 h-6 text-[#15B46A]" />
              Instrucciones de Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              {/* Step 1 */}
              <div className="border-l-4 border-[#15B46A] pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge className="bg-[#15B46A] mb-2">Paso 1</Badge>
                    <h3 className="text-lg font-bold">Crear manifest.json</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      En la carpeta <code className="bg-gray-100 px-2 py-1 rounded">public/</code> de tu proyecto
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(manifestJson, 'manifest')}
                  >
                    {copiedSteps.manifest ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> Copiado!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copiar</>
                    )}
                  </Button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs mt-2">
                  {manifestJson}
                </pre>
              </div>

              {/* Step 2 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge className="bg-blue-500 mb-2">Paso 2</Badge>
                    <h3 className="text-lg font-bold">Crear sw.js (Service Worker)</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      En la carpeta <code className="bg-gray-100 px-2 py-1 rounded">public/</code>
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(serviceWorkerJs, 'sw')}
                  >
                    {copiedSteps.sw ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> Copiado!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copiar</>
                    )}
                  </Button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs mt-2 max-h-96">
                  {serviceWorkerJs}
                </pre>
              </div>

              {/* Step 3 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge className="bg-purple-500 mb-2">Paso 3</Badge>
                    <h3 className="text-lg font-bold">Agregar Meta Tags en index.html</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Dentro del <code className="bg-gray-100 px-2 py-1 rounded">&lt;head&gt;</code>
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(indexHtmlMetaTags, 'meta')}
                  >
                    {copiedSteps.meta ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> Copiado!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copiar</>
                    )}
                  </Button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs mt-2">
                  {indexHtmlMetaTags}
                </pre>
              </div>

              {/* Step 4 */}
              <div className="border-l-4 border-orange-500 pl-4">
                <Badge className="bg-orange-500 mb-2">Paso 4</Badge>
                <h3 className="text-lg font-bold mb-2">Crear Íconos</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Crea una carpeta <code className="bg-gray-100 px-2 py-1 rounded">public/icons/</code> y genera los siguientes íconos:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'].map(size => (
                    <div key={size} className="bg-gray-50 border rounded-lg p-3 text-center">
                      <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs font-mono">{size}</p>
                      <p className="text-xs text-gray-500">icon-{size}.png</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-900 font-semibold mb-2">🎨 Generador Recomendado:</p>
                  <a 
                    href="https://www.pwabuilder.com/imageGenerator" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    PWA Builder Image Generator →
                  </a>
                  <p className="text-xs text-gray-600 mt-1">
                    Sube tu logo y genera todos los tamaños automáticamente
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="border-l-4 border-green-500 pl-4">
                <Badge className="bg-green-500 mb-2">Paso 5</Badge>
                <h3 className="text-lg font-bold mb-2">Registrar Service Worker</h3>
                <p className="text-sm text-gray-600 mb-3">
                  El componente PWAInstallPrompt ya registra el Service Worker automáticamente
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900 font-semibold mb-2">✅ Ya está configurado en:</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <code className="bg-white px-2 py-1 rounded">pages/Home.jsx</code></li>
                    <li>• <code className="bg-white px-2 py-1 rounded">components/pwa/PWAInstallPrompt.jsx</code></li>
                  </ul>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-[#15B46A]" />
              Probar la PWA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <Smartphone className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-lg mb-2">Android</h3>
                <ol className="text-sm space-y-2 text-gray-700">
                  <li>1. Abre Chrome en tu teléfono</li>
                  <li>2. Ve a tu sitio web</li>
                  <li>3. Menú → "Agregar a pantalla de inicio"</li>
                  <li>4. ¡Listo! La app aparecerá en tu home</li>
                </ol>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <Apple className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-bold text-lg mb-2">iOS (iPhone/iPad)</h3>
                <ol className="text-sm space-y-2 text-gray-700">
                  <li>1. Abre Safari (no Chrome)</li>
                  <li>2. Ve a tu sitio web</li>
                  <li>3. Toca el botón compartir ⬆️</li>
                  <li>4. "Agregar a pantalla de inicio"</li>
                </ol>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>💡 Tip:</strong> Para probar en tu computadora, abre Chrome DevTools (F12) → 
                Application → Service Workers y Manifest
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#15B46A]" />
              Siguientes Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className="text-sm text-gray-600">Configurar Firebase Cloud Messaging</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">Offline Mode</p>
                  <p className="text-sm text-gray-600">Ya está configurado con Service Worker</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">Install Prompt</p>
                  <p className="text-sm text-gray-600">Ya aparece automáticamente después de 30s</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}