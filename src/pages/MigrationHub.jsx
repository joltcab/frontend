import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Terminal, Database, Server, CheckCircle, AlertTriangle } from "lucide-react";

export default function MigrationHub() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  // ============================================================
  // FASE 1: EXPORTAR DATOS DESDE BASE44
  // ============================================================

  const exportDataScript = `// ============================================
// PASO 1: EXPORTAR TODOS LOS DATOS DE BASE44
// ============================================
// Ejecuta esto en la consola del navegador en tu app
// O créalo como una página temporal

import joltcab from '@/lib/joltcab-api';

const exportAllData = async () => {
  console.log('🚀 Iniciando exportación de datos...');
  
  const entities = [
    'User',
    'DriverProfile',
    'CorporateProfile',
    'HotelProfile',
    'DispatcherProfile',
    'PartnerProfile',
    'Ride',
    'Vehicle',
    'VehicleDocument',
    'Document',
    'Transaction',
    'Wallet',
    'PaymentMethod',
    'PromoCode',
    'PromoCodeUsage',
    'SupportTicket',
    'ChatMessage',
    'VerificationData',
    'ServiceType',
    'Country',
    'City',
    'PriceConfiguration',
    'Zone',
    'ZonePrice',
    'CarRentalPackage',
    'SystemConfiguration',
    'Review',
    'Notification',
    'NotificationSettings',
    'TripLocation',
    'RideCancellation',
    'ScheduledRide',
    'DriverEarning',
    'EmailSettings',
    'EmailTemplate',
    'SMSTemplate',
    'AdminUser',
    'Role',
    'BlogPost',
    'Event',
    'CustomPage',
    'Category',
    'Tag',
    'Comment',
    'AppearanceSettings'
  ];

  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    appName: 'JoltCab',
    entities: {}
  };

  let totalRecords = 0;

  for (const entityName of entities) {
    try {
      console.log('📦 Exportando ' + entityName + '...');
      
  const records = await joltcab.entities[entityName].list();
      
      exportData.entities[entityName] = records;
      totalRecords += records.length;
      
      console.log('✅ ' + entityName + ': ' + records.length + ' records');
      
    } catch (error) {
      console.warn('⚠️ Error en ' + entityName + ':', error.message);
      exportData.entities[entityName] = [];
    }
  }

  console.log('\\n✅ Exportación completa!');
  console.log('📊 Total de registros: ' + totalRecords);

  // Descargar JSON
  const blob = new Blob(
    [JSON.stringify(exportData, null, 2)], 
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'joltcab-export-' + Date.now() + '.json';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();

  console.log('💾 Archivo descargado!');
  
  return exportData;
};

// EJECUTAR EXPORTACIÓN
exportAllData();`;

  // ============================================================
  // FASE 2: DOCKER COMPOSE
  // ============================================================

  const dockerCompose = `version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: joltcab_postgres
    restart: always
    environment:
      POSTGRES_DB: joltcab
      POSTGRES_USER: joltcab_user
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    ports:
      - "5432:5432"
    command: >
      postgres
      -c max_connections=500
      -c shared_buffers=2GB
      -c effective_cache_size=6GB
      -c maintenance_work_mem=512MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c work_mem=8MB
      -c min_wal_size=1GB
      -c max_wal_size=4GB

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: joltcab_redis
    restart: always
    command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: joltcab_backend
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://joltcab_user:\${DB_PASSWORD}@postgres:5432/joltcab
      REDIS_URL: redis://redis:6379
      JWT_SECRET: \${JWT_SECRET}
      FRONTEND_URL: \${FRONTEND_URL}
      
      # Google Maps
      GOOGLE_MAPS_API_KEY: \${GOOGLE_MAPS_API_KEY}
      
      # Stripe
      STRIPE_SECRET_KEY: \${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: \${STRIPE_WEBHOOK_SECRET}
      
      # Twilio
      TWILIO_ACCOUNT_SID: \${TWILIO_ACCOUNT_SID}
      TWILIO_AUTH_TOKEN: \${TWILIO_AUTH_TOKEN}
      TWILIO_PHONE_NUMBER: \${TWILIO_PHONE_NUMBER}
      
      # Cloudflare R2
      R2_ACCESS_KEY_ID: \${R2_ACCESS_KEY_ID}
      R2_SECRET_ACCESS_KEY: \${R2_SECRET_ACCESS_KEY}
      R2_BUCKET_NAME: \${R2_BUCKET_NAME}
      R2_ENDPOINT: \${R2_ENDPOINT}
      R2_PUBLIC_URL: \${R2_PUBLIC_URL}
      
    depends_on:
      - postgres
      - redis
    ports:
      - "3000:3000"
    volumes:
      - ./backend/logs:/app/logs

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: joltcab_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:`;

  // ============================================================
  // FASE 3: SETUP VPS SCRIPT
  // ============================================================

  const setupVPS = `#!/bin/bash
# ============================================
# JoltCab - Setup VPS Hetzner (Ubuntu 22.04)
# ============================================

set -e

echo "🚀 JoltCab - Setup Hetzner VPS"
echo "================================"

# Update system
echo "📦 Actualizando sistema..."
apt-get update
apt-get upgrade -y

# Install essentials
echo "🔧 Instalando herramientas esenciales..."
apt-get install -y \\
  curl \\
  wget \\
  git \\
  vim \\
  htop \\
  ufw \\
  fail2ban \\
  certbot \\
  python3-certbot-nginx

# Install Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
echo "🐳 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure Firewall
echo "🔥 Configurando firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create project directory
echo "📁 Creando directorio del proyecto..."
mkdir -p /opt/joltcab
cd /opt/joltcab

# Clone or download project files
echo "📥 Descarga los archivos del proyecto ahora y colócalos en /opt/joltcab/"
echo ""
echo "Archivos necesarios:"
echo "  - docker-compose.yml"
echo "  - .env"
echo "  - nginx.conf"
echo "  - backend/ (carpeta)"
echo "  - init-db.sql"
echo ""
echo "✅ Setup inicial completado!"
echo ""
echo "Próximos pasos:"
echo "1. Sube los archivos a /opt/joltcab/"
echo "2. Configura .env con tus credenciales"
echo "3. Ejecuta: docker-compose up -d"
echo "4. Configura SSL: certbot --nginx -d api.tudominio.com"
`;

  // ============================================================
  // FASE 4: INIT DB SQL
  // ============================================================

  const initDbSql = `-- ============================================
-- JoltCab Database Schema
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user',
  profile_image TEXT,
  language VARCHAR(10) DEFAULT 'en',
  city VARCHAR(100),
  country VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending',
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver profiles
CREATE TABLE IF NOT EXISTS "DriverProfile" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR(255) REFERENCES "User"(email),
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year VARCHAR(10),
  vehicle_color VARCHAR(50),
  vehicle_plate VARCHAR(50),
  vehicle_vin VARCHAR(50),
  vehicle_seats INTEGER DEFAULT 4,
  service_type_id VARCHAR(100),
  service_type_name VARCHAR(100),
  background_check_status VARCHAR(50) DEFAULT 'pending',
  is_online BOOLEAN DEFAULT FALSE,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  last_location_update TIMESTAMP,
  rating DECIMAL(3, 2) DEFAULT 5.0,
  total_trips INTEGER DEFAULT 0,
  bank_account_holder VARCHAR(255),
  bank_routing_number VARCHAR(50),
  bank_account_number VARCHAR(50),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rides table
CREATE TABLE IF NOT EXISTS "Ride" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passenger_email VARCHAR(255),
  driver_email VARCHAR(255),
  dispatcher_email VARCHAR(255),
  pickup_location TEXT,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  dropoff_location TEXT,
  dropoff_lat DECIMAL(10, 8),
  dropoff_lng DECIMAL(11, 8),
  driver_current_lat DECIMAL(10, 8),
  driver_current_lng DECIMAL(11, 8),
  driver_heading DECIMAL(5, 2),
  driver_speed DECIMAL(6, 2),
  passenger_offer DECIMAL(10, 2),
  driver_offer DECIMAL(10, 2),
  agreed_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'requested',
  payment_method VARCHAR(50),
  rating_passenger INTEGER,
  rating_driver INTEGER,
  distance_km DECIMAL(10, 2),
  duration_minutes INTEGER,
  scheduled_date DATE,
  scheduled_time VARCHAR(10),
  service_type_id VARCHAR(100),
  emergency_activated BOOLEAN DEFAULT FALSE,
  emergency_timestamp TIMESTAMP,
  emergency_location TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallets
CREATE TABLE IF NOT EXISTS "Wallet" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR(255) UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'USD',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE IF NOT EXISTS "Transaction" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR(255),
  type VARCHAR(50),
  amount DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  reference VARCHAR(255),
  ride_id UUID,
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Types
CREATE TABLE IF NOT EXISTS "ServiceType" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  service_type VARCHAR(50) DEFAULT 'Normal',
  business_status BOOLEAN DEFAULT TRUE,
  default_selected BOOLEAN DEFAULT FALSE,
  description TEXT,
  icon_url TEXT,
  map_pin_url TEXT,
  max_space INTEGER DEFAULT 4,
  priority INTEGER DEFAULT 1,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countries
CREATE TABLE IF NOT EXISTS "Country" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  flag_url TEXT,
  currency VARCHAR(10) DEFAULT 'USD',
  currency_sign VARCHAR(5) DEFAULT '$',
  country_code VARCHAR(10),
  business_status BOOLEAN DEFAULT TRUE,
  bonus_to_user DECIMAL(10, 2) DEFAULT 150,
  bonus_to_referral DECIMAL(10, 2) DEFAULT 150,
  referral_max_usage INTEGER DEFAULT 10,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities
CREATE TABLE IF NOT EXISTS "City" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  full_name VARCHAR(255),
  country_id UUID REFERENCES "Country"(id),
  city_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city_radius DECIMAL(10, 2) DEFAULT 50,
  city_boundaries JSONB,
  is_use_city_boundary BOOLEAN DEFAULT FALSE,
  unit VARCHAR(10) DEFAULT 'km',
  business_status BOOLEAN DEFAULT TRUE,
  timezone VARCHAR(50),
  destination_cities TEXT[],
  is_payment_mode_cash BOOLEAN DEFAULT TRUE,
  is_payment_mode_card BOOLEAN DEFAULT TRUE,
  payment_gateway TEXT[],
  airport_business BOOLEAN DEFAULT FALSE,
  zone_business BOOLEAN DEFAULT FALSE,
  city_business BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add more tables as needed...

-- Create indexes
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_driver_user_email ON "DriverProfile"(user_email);
CREATE INDEX idx_ride_passenger ON "Ride"(passenger_email);
CREATE INDEX idx_ride_driver ON "Ride"(driver_email);
CREATE INDEX idx_ride_status ON "Ride"(status);
CREATE INDEX idx_transaction_user ON "Transaction"(user_email);

-- Success message
SELECT 'Database schema created successfully!' as message;`;

  // ============================================================
  // FASE 5: ENV FILE
  // ============================================================

  const envFile = `# ============================================
# JoltCab - Environment Variables
# ============================================

# Database
DB_PASSWORD=tu_password_seguro_aqui
DATABASE_URL=postgresql://joltcab_user:tu_password_seguro_aqui@postgres:5432/joltcab

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=tu_jwt_secret_muy_largo_y_aleatorio_aqui

# Frontend URL
FRONTEND_URL=https://tudominio.com

# Google Maps API
GOOGLE_MAPS_API_KEY=tu_google_maps_key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Cloudflare R2
R2_ACCESS_KEY_ID=tu_r2_access_key
R2_SECRET_ACCESS_KEY=tu_r2_secret_key
R2_BUCKET_NAME=tu_bucket_name
R2_ENDPOINT=https://xxxx.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://tu-bucket.r2.dev`;

  // ============================================================
  // FASE 6: NGINX CONFIG
  // ============================================================

  const nginxConf = `user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=3r/s;

    # Backend upstream
    upstream backend {
        server backend:3000;
        keepalive 32;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name api.tudominio.com;

        ssl_certificate /etc/letsencrypt/live/api.tudominio.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/api.tudominio.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # API endpoints
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Auth endpoints (stricter rate limit)
        location /api/auth/ {
            limit_req zone=auth_limit burst=5 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket for real-time tracking
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_read_timeout 86400;
        }

        # Health check
        location /health {
            proxy_pass http://backend;
            access_log off;
        }
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name api.tudominio.com;
        return 301 https://$server_name$request_uri;
    }
}`;

  // ============================================================
  // FASE 7: IMPORT DATA SCRIPT
  // ============================================================

  const importDataScript = `// ============================================
// Import Data Script - Node.js
// ============================================
// Run: node import-data.js joltcab-export-123456.json

const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const importData = async (filename) => {
  console.log('📥 Importando datos desde:', filename);

  // Read export file
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const entities = data.entities;

  let totalImported = 0;

  // Import in correct order (respecting foreign keys)
  const importOrder = [
    'Country',
    'City',
    'ServiceType',
    'User',
    'DriverProfile',
    'CorporateProfile',
    'HotelProfile',
    'DispatcherProfile',
    'PartnerProfile',
    'Vehicle',
    'VehicleDocument',
    'Document',
    'Wallet',
    'PaymentMethod',
    'PromoCode',
    'Ride',
    'Transaction',
    'Review',
    'TripLocation',
    'RideCancellation',
    'ScheduledRide',
    'DriverEarning',
    'Notification',
    'NotificationSettings',
    'SupportTicket',
    'ChatMessage',
    'VerificationData',
    'PriceConfiguration',
    'Zone',
    'ZonePrice',
    'CarRentalPackage',
    'SystemConfiguration',
    'PromoCodeUsage',
    'EmailSettings',
    'EmailTemplate',
    'SMSTemplate',
    'AdminUser',
    'Role',
    'BlogPost',
    'Event',
    'CustomPage',
    'Category',
    'Tag',
    'Comment',
    'AppearanceSettings'
  ];

  for (const entityName of importOrder) {
    const records = entities[entityName] || [];
    
    if (records.length === 0) continue;

    console.log('📦 Importando ' + entityName + ' (' + records.length + ' records)...');

    for (const record of records) {
      try {
        // Get columns and values
        const columns = Object.keys(record);
        const values = Object.values(record);
        
        // Build INSERT query
        const placeholders = columns.map((_, i) => '$' + (i + 1)).join(', ');
        const query = 'INSERT INTO "' + entityName + '" (' + 
                     columns.map(c => '"' + c + '"').join(', ') + 
                     ') VALUES (' + placeholders + ') ON CONFLICT (id) DO NOTHING';

        await pool.query(query, values);
        totalImported++;

      } catch (error) {
        console.warn('⚠️ Error importando registro en ' + entityName + ':', error.message);
      }
    }

    console.log('✅ ' + entityName + ' completado');
  }

  console.log('\\n✅ Importación completada!');
  console.log('📊 Total registros importados: ' + totalImported);
  
  await pool.end();
};

// Run import
const filename = process.argv[2];
if (!filename) {
  console.error('❌ Error: Debes especificar el archivo JSON');
  console.log('Uso: node import-data.js joltcab-export-123456.json');
  process.exit(1);
}

importData(filename).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});`;

  // ============================================================
  // RENDER UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-[#15B46A] shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] text-white">
            <CardTitle className="text-4xl flex items-center gap-3">
              <Server className="w-10 h-10" />
              Migración Completa a Hetzner VPS
            </CardTitle>
            <p className="text-white/90 mt-2">
              Guía paso a paso con todos los scripts necesarios. Tiempo estimado: 2-3 horas.
            </p>
          </CardHeader>
        </Card>

        {/* Alert de Seguridad */}
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>⚠️ IMPORTANTE:</strong> Nunca compartas tus claves API públicamente. 
            Guarda todos los archivos con claves en un lugar seguro (.env, backups, etc.).
          </AlertDescription>
        </Alert>

        {/* Progress Steps */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {[
            { num: 1, title: 'Exportar Datos', icon: Database },
            { num: 2, title: 'Crear VPS', icon: Server },
            { num: 3, title: 'Setup Inicial', icon: Terminal },
            { num: 4, title: 'Subir Archivos', icon: Copy },
            { num: 5, title: 'Configurar', icon: CheckCircle },
            { num: 6, title: 'Importar DB', icon: Database },
            { num: 7, title: 'Go Live!', icon: CheckCircle }
          ].map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.num} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-3 bg-[#15B46A]/10 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#15B46A]" />
                  </div>
                  <div className="text-2xl font-bold text-[#15B46A] mb-1">{step.num}</div>
                  <div className="text-xs text-gray-600">{step.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="step1" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="step1">Paso 1</TabsTrigger>
            <TabsTrigger value="step2">Paso 2</TabsTrigger>
            <TabsTrigger value="step3">Paso 3</TabsTrigger>
            <TabsTrigger value="step4">Paso 4</TabsTrigger>
            <TabsTrigger value="step5">Paso 5</TabsTrigger>
            <TabsTrigger value="step6">Paso 6</TabsTrigger>
            <TabsTrigger value="step7">Paso 7</TabsTrigger>
          </TabsList>

          {/* STEP 1: EXPORTAR DATOS */}
          <TabsContent value="step1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-[#15B46A]" />
                  Paso 1: Exportar Todos los Datos de base44
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>📋 Instrucciones:</strong>
                    <ol className="list-decimal ml-5 mt-2 space-y-1">
                      <li>Abre la consola del navegador (F12) en tu app JoltCab</li>
                      <li>Copia y pega el script completo abajo</li>
                      <li>Presiona Enter y espera (puede tardar 2-3 minutos)</li>
                      <li>Se descargará un archivo JSON automáticamente</li>
                      <li>Guarda ese archivo en un lugar seguro</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(exportDataScript, 'export')}
                  >
                    {copied === 'export' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <pre className="text-xs overflow-x-auto">{exportDataScript}</pre>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => downloadFile('01-export-data.js', exportDataScript)}
                    className="flex-1 bg-[#15B46A] hover:bg-[#0F9456]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Script
                  </Button>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertDescription className="text-yellow-800">
                    <strong>⏱️ Tiempo estimado:</strong> 2-5 minutos (dependiendo de la cantidad de datos)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STEP 2: CREAR VPS */}
          <TabsContent value="step2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-6 h-6 text-[#15B46A]" />
                  Paso 2: Crear VPS en Hetzner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>🌐 Crea tu VPS:</strong>
                    <ol className="list-decimal ml-5 mt-2 space-y-2">
                      <li>Ve a: <a href="https://www.hetzner.com/cloud" target="_blank" className="underline font-bold">hetzner.com/cloud</a></li>
                      <li>Crea una cuenta (usa tarjeta de crédito o PayPal)</li>
                      <li>Haz click en "New Project" → "Add Server"</li>
                      <li>
                        <strong>Selecciona:</strong>
                        <ul className="list-disc ml-5 mt-1 space-y-1">
                          <li>Location: <strong>Nuremberg, Germany</strong> (o el más cercano)</li>
                          <li>Image: <strong>Ubuntu 22.04</strong></li>
                          <li>Type: <strong>CCX33</strong> (8 vCPU, 32 GB RAM) - €45/mes</li>
                          <li>Networking: <strong>IPv4 + IPv6</strong></li>
                          <li>SSH Keys: Genera una (o súbela si ya la tienes)</li>
                        </ul>
                      </li>
                      <li>Click en <strong>"Create & Buy Now"</strong></li>
                      <li>Espera 1-2 minutos a que el servidor esté listo</li>
                      <li><strong>GUARDA LA IP DEL SERVIDOR</strong> (la necesitarás)</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-bold mb-2">💰 Costos Mensuales:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>VPS CCX33 (8 CPU, 32GB RAM):</span>
                      <span className="font-bold">€45/mes (~$49)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cloudflare R2 (Storage):</span>
                      <span className="font-bold">~$5/mes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cloudflare Pages (Frontend):</span>
                      <span className="font-bold text-green-600">$0 (gratis)</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-[#15B46A]">~$55/mes</span>
                    </div>
                  </div>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>✅ Ahorro vs base44:</strong> ~$45/mes (45% más barato)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STEP 3: SETUP INICIAL */}
          <TabsContent value="step3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-[#15B46A]" />
                  Paso 3: Setup Inicial del VPS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>🔌 Conectarse al VPS:</strong>
                    <ol className="list-decimal ml-5 mt-2 space-y-1">
                      <li>Abre tu terminal (PowerShell en Windows, Terminal en Mac/Linux)</li>
                      <li>Ejecuta: <code className="bg-black text-green-400 px-2 py-1 rounded">ssh root@TU_IP_DEL_VPS</code></li>
                      <li>Si te pregunta "Are you sure?", escribe: <code>yes</code></li>
                      <li>Ya estás dentro del servidor! 🎉</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-bold mb-2">📥 Script de Setup Automático:</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Este script instala Docker, Docker Compose, Nginx, Certbot y configura el firewall.
                  </p>
                </div>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(setupVPS, 'setup')}
                  >
                    {copied === 'setup' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <pre className="text-xs overflow-x-auto">{setupVPS}</pre>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => downloadFile('02-setup-vps.sh', setupVPS)}
                    className="flex-1 bg-[#15B46A] hover:bg-[#0F9456]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar setup.sh
                  </Button>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertDescription className="text-yellow-800">
                    <strong>📋 Para ejecutar:</strong>
                    <ol className="list-decimal ml-5 mt-2">
                      <li>Descarga el archivo <code>setup.sh</code></li>
                      <li>Sube al VPS: <code className="bg-white px-1">scp setup.sh root@TU_IP:/root/</code></li>
                      <li>Conéctate al VPS: <code className="bg-white px-1">ssh root@TU_IP</code></li>
                      <li>Ejecuta: <code className="bg-white px-1">chmod +x setup.sh && ./setup.sh</code></li>
                      <li>Espera 5-10 minutos ☕</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STEP 4: ARCHIVOS DE CONFIGURACIÓN */}
          <TabsContent value="step4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-6 h-6 text-[#15B46A]" />
                  Paso 4: Descargar y Subir Archivos de Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Docker Compose */}
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Badge className="bg-blue-500">1</Badge>
                    docker-compose.yml
                  </h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative max-h-64 overflow-y-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(dockerCompose, 'docker')}
                    >
                      {copied === 'docker' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <pre className="text-xs">{dockerCompose}</pre>
                  </div>
                  <Button
                    onClick={() => downloadFile('docker-compose.yml', dockerCompose)}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>

                {/* ENV File */}
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Badge className="bg-blue-500">2</Badge>
                    .env (Variables de Entorno)
                  </h4>
                  <Alert className="bg-red-50 border-red-200 mb-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 text-sm">
                      <strong>🔒 MUY IMPORTANTE:</strong> Reemplaza TODOS los valores con tus credenciales reales. 
                      Nunca compartas este archivo públicamente.
                    </AlertDescription>
                  </Alert>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative max-h-64 overflow-y-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(envFile, 'env')}
                    >
                      {copied === 'env' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <pre className="text-xs">{envFile}</pre>
                  </div>
                  <Button
                    onClick={() => downloadFile('.env', envFile)}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>

                {/* Nginx Config */}
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Badge className="bg-blue-500">3</Badge>
                    nginx.conf
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>⚠️ Reemplaza:</strong> <code className="bg-yellow-100 px-1">api.tudominio.com</code> con tu dominio real
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative max-h-64 overflow-y-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(nginxConf, 'nginx')}
                    >
                      {copied === 'nginx' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <pre className="text-xs">{nginxConf}</pre>
                  </div>
                  <Button
                    onClick={() => downloadFile('nginx.conf', nginxConf)}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>

                {/* Init DB SQL */}
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Badge className="bg-blue-500">4</Badge>
                    init-db.sql (Schema de Base de Datos)
                  </h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative max-h-64 overflow-y-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(initDbSql, 'initdb')}
                    >
                      {copied === 'initdb' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <pre className="text-xs">{initDbSql}</pre>
                  </div>
                  <Button
                    onClick={() => downloadFile('init-db.sql', initDbSql)}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>

                {/* Upload Instructions */}
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>📤 Subir Archivos al VPS:</strong>
                    <pre className="mt-2 bg-black text-green-400 p-3 rounded text-xs overflow-x-auto">
scp docker-compose.yml root@TU_IP:/opt/joltcab/
scp .env root@TU_IP:/opt/joltcab/
scp nginx.conf root@TU_IP:/opt/joltcab/
scp init-db.sql root@TU_IP:/opt/joltcab/</pre>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STEP 5: CONFIGURAR */}
          <TabsContent value="step5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-[#15B46A]" />
                  Paso 5: Iniciar Servicios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>🚀 Comandos a ejecutar en el VPS:</strong>
                    <pre className="mt-2 bg-black text-green-400 p-3 rounded text-sm space-y-2 overflow-x-auto">
{`# 1. Ir a la carpeta del proyecto
cd /opt/joltcab

# 2. Verificar que todos los archivos estén ahí
ls -la
# Deberías ver: docker-compose.yml, .env, nginx.conf, init-db.sql

# 3. Iniciar servicios
docker-compose up -d

# 4. Ver logs en tiempo real
docker-compose logs -f

# 5. Espera 2-3 minutos a que todo inicie
# Verás mensajes de PostgreSQL, Redis, Backend y Nginx

# 6. Verificar que todo esté corriendo
docker-compose ps
# Todos los servicios deben estar "Up"`}
</pre>
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-bold mb-3">✅ Checklist:</h4>
                  <div className="space-y-2">
                    {[
                      'PostgreSQL corriendo (puerto 5432)',
                      'Redis corriendo (puerto 6379)',
                      'Backend corriendo (puerto 3000)',
                      'Nginx corriendo (puerto 80/443)'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#15B46A]" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>✅ Si no hay errores en los logs, ¡todo está funcionando!</strong>
                    <p className="mt-2 text-sm">
                      Prueba: <code className="bg-white px-1">curl http://localhost:3000/health</code>
                      <br />
                      Deberías ver: <code className="bg-white px-1">{"{"}"status":"ok"{"}"}</code>
                    </p>
                  </AlertDescription>
                </Alert>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>⚠️ Si algo falla:</strong>
                    <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                      <li>Revisa logs: <code className="bg-white px-1">docker-compose logs backend</code></li>
                      <li>Verifica .env: <code className="bg-white px-1">cat .env</code></li>
                      <li>Reinicia servicios: <code className="bg-white px-1">docker-compose restart</code></li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STEP 6: IMPORTAR DATOS */}
          <TabsContent value="step6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-[#15B46A]" />
                  Paso 6: Importar Datos desde base44
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>📥 Preparación:</strong>
                    <ol className="list-decimal ml-5 mt-2 space-y-1">
                      <li>Descarga el script de importación abajo</li>
                      <li>Sube el script Y el archivo JSON exportado al VPS</li>
                      <li>Ejecuta el script</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-bold mb-2">import-data.js</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative max-h-96 overflow-y-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(importDataScript, 'import')}
                    >
                      {copied === 'import' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <pre className="text-xs">{importDataScript}</pre>
                  </div>
                  <Button
                    onClick={() => downloadFile('import-data.js', importDataScript)}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar import-data.js
                  </Button>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertDescription className="text-yellow-800">
                    <strong>📤 Subir archivos al VPS:</strong>
                    <pre className="mt-2 bg-black text-green-400 p-3 rounded text-xs overflow-x-auto">
{`# Desde tu computadora:
scp import-data.js root@TU_IP:/opt/joltcab/
scp joltcab-export-*.json root@TU_IP:/opt/joltcab/

# Luego conéctate al VPS:
ssh root@TU_IP

# Y ejecuta:
cd /opt/joltcab
docker-compose exec backend node import-data.js joltcab-export-*.json

# Espera 5-15 minutos (dependiendo de la cantidad de datos)`}
</pre>
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-bold mb-3">📊 Progreso de Importación:</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Verás mensajes como:
                  </p>
                  <pre className="bg-black text-green-400 p-3 rounded text-xs">
{`📥 Importando datos desde: joltcab-export-123456.json
📦 Importando User (1247 records)...
✅ User completado
📦 Importando Ride (3892 records)...
✅ Ride completado
...
✅ Importación completada!
📊 Total registros importados: 12,847`}
                  </pre>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>✅ Verificar que se importó correctamente:</strong>
                    <pre className="mt-2 bg-black text-green-400 p-2 rounded text-xs">
{`docker-compose exec postgres psql -U joltcab_user -d joltcab -c "SELECT COUNT(*) FROM \\"User\\""`}
                    </pre>
                    <p className="mt-2 text-sm">
                      Deberías ver el número de usuarios que exportaste.
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STEP 7: GO LIVE */}
          <TabsContent value="step7">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-[#15B46A]" />
                  Paso 7: Configurar Dominio y SSL - ¡Go Live!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* DNS Configuration */}
                <div>
                  <h4 className="font-bold mb-3 text-lg">1️⃣ Configurar DNS</h4>
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      <strong>🌐 En tu proveedor de dominio (GoDaddy, Namecheap, Cloudflare, etc.):</strong>
                      <div className="mt-3 space-y-2">
                        <div className="bg-white p-3 rounded">
                          <p className="font-mono text-sm">
                            <strong>Tipo:</strong> A Record<br />
                            <strong>Name:</strong> api<br />
                            <strong>Value:</strong> TU_IP_DEL_VPS<br />
                            <strong>TTL:</strong> 300
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="font-mono text-sm">
                            <strong>Tipo:</strong> A Record<br />
                            <strong>Name:</strong> @<br />
                            <strong>Value:</strong> TU_IP_DEL_VPS<br />
                            <strong>TTL:</strong> 300
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm">
                        <strong>⏱️ Espera 5-15 minutos</strong> a que se propague el DNS.
                      </p>
                    </AlertDescription>
                  </Alert>
                </div>

                {/* SSL Certificate */}
                <div>
                  <h4 className="font-bold mb-3 text-lg">2️⃣ Instalar Certificado SSL (HTTPS)</h4>
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      <strong>🔒 Ejecuta en el VPS:</strong>
                      <pre className="mt-2 bg-black text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Instalar certificado SSL gratis con Let's Encrypt
certbot --nginx -d api.tudominio.com -d tudominio.com

# Sigue las instrucciones:
# 1. Ingresa tu email
# 2. Acepta términos (Y)
# 3. Elige si compartir email (N recomendado)
# 4. Elige opción 2 (Redirect HTTP to HTTPS)

# ¡Listo! Ya tienes HTTPS 🎉`}
</pre>
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Frontend Deployment */}
                <div>
                  <h4 className="font-bold mb-3 text-lg">3️⃣ Desplegar Frontend en Cloudflare Pages</h4>
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      <strong>🚀 Cloudflare Pages (Gratis):</strong>
                      <ol className="list-decimal ml-5 mt-2 space-y-2">
                        <li>Ve a: <a href="https://dash.cloudflare.com" target="_blank" className="underline font-bold">dash.cloudflare.com</a></li>
                        <li>Workers & Pages → Create Application → Pages</li>
                        <li>Connect to Git → Selecciona tu repositorio (GitHub/GitLab)</li>
                        <li>
                          <strong>Build settings:</strong>
                          <div className="bg-white p-2 mt-2 rounded">
                            <p className="font-mono text-xs">
                              Framework: React<br />
                              Build command: npm run build<br />
                              Output directory: dist<br />
                              Node version: 20
                            </p>
                          </div>
                        </li>
                        <li>
                          <strong>Environment variables:</strong>
                          <div className="bg-white p-2 mt-2 rounded">
                            <p className="font-mono text-xs">
                              VITE_API_URL=https://api.tudominio.com<br />
                              VITE_WS_URL=wss://api.tudominio.com
                            </p>
                          </div>
                        </li>
                        <li>Click "Save and Deploy"</li>
                        <li>Espera 2-3 minutos</li>
                        <li>¡Tu app estará en: <strong>https://tudominio.pages.dev</strong>!</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Testing */}
                <div>
                  <h4 className="font-bold mb-3 text-lg">4️⃣ Probar Todo</h4>
                  <div className="space-y-3">
                    {[
                      { test: 'API Health Check', cmd: 'curl https://api.tudominio.com/health', expected: '{"status":"ok"}' },
                      { test: 'WebSocket', cmd: 'wscat -c wss://api.tudominio.com/socket.io/', expected: 'Connected' },
                      { test: 'Frontend', cmd: 'Abrir https://tudominio.com en el navegador', expected: 'App cargando' },
                      { test: 'Login', cmd: 'Iniciar sesión con un usuario', expected: 'Dashboard carga' },
                      { test: 'Crear ride', cmd: 'Solicitar un viaje', expected: 'Viaje creado' }
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded border">
                        <div className="flex items-start gap-3">
                          <Badge className="bg-[#15B46A]">{i + 1}</Badge>
                          <div className="flex-1">
                            <p className="font-bold text-sm">{item.test}</p>
                            <p className="text-xs text-gray-600 mt-1 font-mono">{item.cmd}</p>
                            <p className="text-xs text-green-600 mt-1">✅ Esperado: {item.expected}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success */}
                <Alert className="bg-gradient-to-r from-green-50 to-green-100 border-green-300">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <AlertDescription>
                    <div className="text-green-900">
                      <h3 className="font-bold text-xl mb-2">🎉 ¡Felicitaciones!</h3>
                      <p className="mb-3">
                        Has migrado exitosamente JoltCab de base44 a Hetzner VPS.
                      </p>
                      <div className="bg-white p-4 rounded-lg space-y-2">
                        <p className="text-sm">
                          <strong>💰 Ahorro mensual:</strong> ~$45 (45% más barato)
                        </p>
                        <p className="text-sm">
                          <strong>🚀 Performance:</strong> VPS dedicado (más rápido)
                        </p>
                        <p className="text-sm">
                          <strong>🔒 Control:</strong> Acceso total a tu infraestructura
                        </p>
                        <p className="text-sm">
                          <strong>📈 Escalabilidad:</strong> Upgrade fácil cuando lo necesites
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Maintenance */}
                <div>
                  <h4 className="font-bold mb-3 text-lg">🔧 Mantenimiento Regular</h4>
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertDescription className="text-yellow-800">
                      <strong>📅 Tareas recomendadas:</strong>
                      <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                        <li><strong>Diario:</strong> Revisar logs (<code>docker-compose logs</code>)</li>
                        <li><strong>Semanal:</strong> Backup de DB (<code>pg_dump</code>)</li>
                        <li><strong>Mensual:</strong> Actualizar sistema (<code>apt-get update && apt-get upgrade</code>)</li>
                        <li><strong>Trimestral:</strong> Revisar uso de recursos (<code>htop</code>)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Support */}
                <div>
                  <h4 className="font-bold mb-3 text-lg">🆘 ¿Necesitas Ayuda?</h4>
                  <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-sm mb-3">
                      Si encuentras problemas durante la migración:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#15B46A]" />
                        Revisa los logs de Docker
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#15B46A]" />
                        Verifica que .env tenga todas las credenciales correctas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#15B46A]" />
                        Comprueba que el firewall permita los puertos 80/443
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#15B46A]" />
                        Reinicia los servicios con <code>docker-compose restart</code>
                      </li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
}