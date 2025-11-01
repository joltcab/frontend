import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, FileCode, Smartphone, Server, 
  GitBranch, Package, BookOpen, Copy, CheckCircle 
} from "lucide-react";

export default function RepositoryReadme() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const projectStructure = {
    backend: {
      title: "Backend (Deno Functions)",
      description: "Serverless functions for business logic",
      structure: `backend/
├── functions/
│   ├── auth/
│   │   ├── registerDriver.js
│   │   ├── registerCorporate.js
│   │   ├── registerHotel.js
│   │   ├── registerDispatcher.js
│   │   ├── registerPartner.js
│   │   ├── authenticateUser.js
│   │   ├── userForgotPassword.js
│   │   └── userResetPassword.js
│   │
│   ├── rides/
│   │   ├── calculateFare.js
│   │   ├── calculateAdvancedFare.js
│   │   ├── estimateTrip.js
│   │   ├── calculateRoute.js
│   │   ├── findNearbyDrivers.js
│   │   ├── assignDriver.js
│   │   ├── cancelRide.js
│   │   ├── rateRide.js
│   │   └── trackDriverLocation.js
│   │
│   ├── payments/
│   │   ├── stripePaymentIntent.js
│   │   ├── stripeRefund.js
│   │   ├── stripeWebhook.js
│   │   ├── processPayment.js
│   │   ├── walletTransfer.js
│   │   ├── payoutDriver.js
│   │   ├── bankTransfer.js
│   │   └── calculateEarnings.js
│   │
│   ├── notifications/
│   │   ├── sendNotification.js
│   │   ├── sendEmail.js
│   │   ├── sendSMS.js
│   │   ├── sendMassNotification.js
│   │   ├── pushNotification.js
│   │   └── notificationTriggers.js
│   │
│   ├── verification/
│   │   ├── uploadDocument.js
│   │   ├── verifyDocumentAI.js
│   │   ├── verifySelfieID.js
│   │   └── backgroundCheck.js
│   │
│   ├── realtime/
│   │   ├── realtimeConnection.js
│   │   ├── realtimeChat.js
│   │   └── realtimeDashboard.js
│   │
│   ├── ai/
│   │   ├── aiDynamicPricing.js
│   │   ├── aiDriverMatching.js
│   │   └── aiSupportChatbot.js
│   │
│   ├── whatsapp/
│   │   ├── whatsappWebhook.js
│   │   ├── whatsappBooking.js
│   │   └── whatsappNotifications.js
│   │
│   ├── maps/
│   │   ├── geocodeAddress.js
│   │   ├── detectZone.js
│   │   └── calculateETA.js
│   │
│   ├── admin/
│   │   ├── adminLogin.js
│   │   ├── createAdminUser.js
│   │   ├── checkPermission.js
│   │   ├── requestUserAccess.js
│   │   └── diagnosticBackend.js
│   │
│   ├── cron/
│   │   ├── cronScheduledRides.js
│   │   ├── cronDocumentExpiry.js
│   │   ├── cronCleanupOldData.js
│   │   └── cronDailyReports.js
│   │
│   ├── storage/
│   │   ├── r2Upload.js
│   │   ├── r2Delete.js
│   │   └── r2GetSignedUrl.js
│   │
│   └── config/
│       ├── systemConfig.js
│       ├── stripeConfig.js
│       ├── twilioConfig.js
│       ├── googleMapsConfig.js
│       ├── emailConfig.js
│       └── constants.js
│
├── package.json
├── deno.json
└── README.md`,
      env: `# Backend Environment Variables
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
GOOGLE_MAPS_API_KEY=AIza...
OPENAI_API_KEY=sk-...
BASE44_APP_ID=...
BASE44_SERVICE_ROLE_KEY=...
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_ENDPOINT=...
CLOUDFLARE_R2_BUCKET_NAME=...`
    },

    frontend: {
      title: "Frontend (React Web App)",
      description: "Progressive Web App for all user roles",
      structure: `frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   ├── icons/
│   └── assets/
│
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Register.jsx
│   │   ├── UniversalLogin.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── DriverDashboard.jsx
│   │   ├── CorporateDashboard.jsx
│   │   ├── HotelDashboard.jsx
│   │   ├── DispatcherDashboard.jsx
│   │   ├── PartnerDashboard.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── Profile.jsx
│   │   ├── Wallet.jsx
│   │   ├── Support.jsx
│   │   ├── RideHistory.jsx
│   │   ├── TrackRide.jsx
│   │   └── ... (70+ pages total)
│   │
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   └── ...
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthTabs.jsx
│   │   │   ├── PassengerSignUpForm.jsx
│   │   │   ├── DriverSignUpForm.jsx
│   │   │   └── ...
│   │   │
│   │   ├── booking/
│   │   │   ├── RideBookingDialog.jsx
│   │   │   └── ...
│   │   │
│   │   ├── maps/
│   │   │   ├── GoogleMapLoader.jsx
│   │   │   ├── MapboxMap.jsx
│   │   │   ├── InteractiveMap.jsx
│   │   │   ├── RouteMap.jsx
│   │   │   └── ZoneDrawer.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── UserManagement.jsx
│   │   │   ├── TripManagement.jsx
│   │   │   ├── FinancialOverview.jsx
│   │   │   └── ... (40+ components)
│   │   │
│   │   ├── tracking/
│   │   │   ├── LiveTrackingMap.jsx
│   │   │   ├── DriverLocationTracker.jsx
│   │   │   └── OnlineToggle.jsx
│   │   │
│   │   ├── payment/
│   │   │   └── AddPaymentMethodDialog.jsx
│   │   │
│   │   ├── realtime/
│   │   │   ├── RealtimeProvider.jsx
│   │   │   └── useRealtimeTracking.js
│   │   │
│   │   ├── ui/ (shadcn components)
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   └── ... (50+ components)
│   │   │
│   │   └── ...
│   │
│   ├── api/
│   │   └── base44Client.js
│   │
│   ├── lib/
│   │   └── utils.js
│   │
│   ├── Layout.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md`,
      dependencies: `{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "@tanstack/react-query": "^5.28.0",
    "@base44/sdk": "^0.7.1",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0",
    "moment": "^2.30.1",
    "recharts": "^2.12.0",
    "react-quill": "^2.0.0",
    "react-hook-form": "^7.50.0",
    "date-fns": "^3.3.0",
    "lodash": "^4.17.21",
    "react-markdown": "^9.0.0",
    "three": "^0.162.0",
    "react-leaflet": "^4.2.1",
    "@hello-pangea/dnd": "^16.6.0"
  },
  "devDependencies": {
    "vite": "^6.3.6",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35"
  }
}`
    },

    mobile: {
      title: "Mobile Apps (React Native)",
      description: "Native iOS and Android applications",
      structure: `mobile/
├── android/
│   ├── app/
│   ├── gradle/
│   └── build.gradle
│
├── ios/
│   ├── JoltCab/
│   ├── JoltCab.xcodeproj/
│   └── Podfile
│
├── src/
│   ├── screens/
│   │   ├── passenger/
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── BookRideScreen.jsx
│   │   │   ├── TrackRideScreen.jsx
│   │   │   └── ...
│   │   │
│   │   ├── driver/
│   │   │   ├── DashboardScreen.jsx
│   │   │   ├── AcceptRideScreen.jsx
│   │   │   ├── NavigationScreen.jsx
│   │   │   └── ...
│   │   │
│   │   └── shared/
│   │       ├── ProfileScreen.jsx
│   │       ├── WalletScreen.jsx
│   │       ├── SupportScreen.jsx
│   │       └── ...
│   │
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.jsx
│   │   │   ├── Marker.jsx
│   │   │   └── Route.jsx
│   │   │
│   │   ├── Booking/
│   │   │   ├── ServiceTypeSelector.jsx
│   │   │   ├── AddressInput.jsx
│   │   │   └── PriceEstimator.jsx
│   │   │
│   │   └── ...
│   │
│   ├── navigation/
│   │   ├── AppNavigator.jsx
│   │   ├── AuthNavigator.jsx
│   │   └── DriverNavigator.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── location.js
│   │   ├── notifications.js
│   │   └── websocket.js
│   │
│   ├── utils/
│   │   ├── helpers.js
│   │   └── constants.js
│   │
│   └── App.jsx
│
├── package.json
├── app.json
├── metro.config.js
└── README.md`,
      dependencies: `{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-maps": "^1.10.0",
    "react-native-geolocation-service": "^5.3.1",
    "@react-native-firebase/app": "^19.0.0",
    "@react-native-firebase/messaging": "^19.0.0",
    "react-native-push-notification": "^8.1.1",
    "@stripe/stripe-react-native": "^0.35.0",
    "react-native-webview": "^13.6.4",
    "axios": "^1.6.5",
    "socket.io-client": "^4.6.1"
  }
}`
    }
  };

  const setupInstructions = `# 🚀 JoltCab - Complete Setup Instructions

## 📋 Prerequisites
- Node.js 18+ and npm/yarn
- Deno 1.40+
- Git
- Xcode (for iOS development)
- Android Studio (for Android development)

## 🔧 Backend Setup

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/joltcab-backend.git
cd joltcab-backend

# Install dependencies
deno cache functions/**/*.js

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Test locally
deno run --allow-net --allow-env functions/calculateFare.js

# Deploy to Deno Deploy
deno deploy --project=joltcab functions/index.js
\`\`\`

## 💻 Frontend Setup

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/joltcab-frontend.git
cd joltcab-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Base44 credentials

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## 📱 Mobile App Setup

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/joltcab-mobile.git
cd joltcab-mobile

# Install dependencies
npm install

# iOS Setup
cd ios && pod install && cd ..

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android

# Build for production
# iOS
cd ios && xcodebuild -workspace JoltCab.xcworkspace -scheme JoltCab -configuration Release

# Android
cd android && ./gradlew assembleRelease
\`\`\`

## 🔐 Required API Keys

1. **Stripe** (payments)
   - Get from: https://dashboard.stripe.com/apikeys
   - Keys needed: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET

2. **Twilio** (SMS notifications)
   - Get from: https://console.twilio.com
   - Keys needed: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

3. **Google Maps** (mapping & geolocation)
   - Get from: https://console.cloud.google.com
   - Keys needed: GOOGLE_MAPS_API_KEY (with Places API, Directions API, Geocoding API enabled)

4. **OpenAI** (AI features)
   - Get from: https://platform.openai.com/api-keys
   - Keys needed: OPENAI_API_KEY

5. **JoltCab Cloud** (backend platform)
   - Get from: https://admin.joltcab.com
   - Managed via Admin; no Base44 keys required

6. **Cloudflare R2** (file storage)
   - Get from: https://dash.cloudflare.com
   - Keys needed: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME

7. **Firebase** (push notifications - mobile only)
   - Get from: https://console.firebase.google.com
   - Download google-services.json (Android) and GoogleService-Info.plist (iOS)

## 📦 Database Schema

All database tables are defined in the \`entities/\` folder as JSON schemas.
They are managed by JoltCab Cloud and created on first run.

Key entities:
- User (authentication & profiles)
- DriverProfile
- Ride
- Transaction
- Notification
- Document
- Vehicle
- And 40+ more...

## 🚀 Deployment

### Backend (Deno Deploy)
\`\`\`bash
deno deploy --project=joltcab-backend --prod
\`\`\`

### Frontend (Vercel/Netlify)
\`\`\`bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
\`\`\`

### Mobile Apps
- iOS: Submit to App Store Connect
- Android: Upload AAB to Google Play Console

## 🔒 Security Notes

- Never commit .env files
- Use environment variables for all secrets
- Enable 2FA on all service accounts
- Regular security audits
- Keep dependencies updated

## 📚 Documentation

- [Backend API Docs](./docs/backend-api.md)
- [Frontend Components](./docs/components.md)
- [Mobile Development](./docs/mobile.md)
- [Deployment Guide](./docs/deployment.md)

## 🆘 Support

- Email: support@joltcab.com
- Discord: https://discord.gg/joltcab
- Docs: https://docs.joltcab.com

## 📄 License

Proprietary - All Rights Reserved
`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-lg mb-6">
            <GitBranch className="w-8 h-8 text-[#15B46A]" />
            <h1 className="text-3xl font-bold text-gray-900">JoltCab Repository</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete project structure for Backend, Frontend, and Mobile Apps
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Server className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">80+</p>
              <p className="text-sm text-gray-600">Backend Functions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <FileCode className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">70+</p>
              <p className="text-sm text-gray-600">Frontend Pages</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Smartphone className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Mobile Apps</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">50+</p>
              <p className="text-sm text-gray-600">Database Entities</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="structure" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Project Structure</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>

          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-6">
            {Object.entries(projectStructure).map(([key, section]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {key === 'backend' && <Server className="w-6 h-6 text-blue-600" />}
                    {key === 'frontend' && <FileCode className="w-6 h-6 text-green-600" />}
                    {key === 'mobile' && <Smartphone className="w-6 h-6 text-purple-600" />}
                    {section.title}
                  </CardTitle>
                  <p className="text-gray-600">{section.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(section.structure)}
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
                      <code>{section.structure}</code>
                    </pre>
                  </div>

                  {section.dependencies && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Dependencies (package.json)</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{section.dependencies}</code>
                      </pre>
                    </div>
                  )}

                  {section.env && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Environment Variables (.env)</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{section.env}</code>
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#15B46A]" />
                  Complete Setup Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(setupInstructions)}
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                    <code>{setupInstructions}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Download Tab */}
          <TabsContent value="download">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-6 h-6 text-[#15B46A]" />
                  Download Project Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    ⚠️ Important Note
                  </h3>
                  <p className="text-yellow-800">
                    This project is currently hosted on Base44 platform. To download all files:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      📁 Option 1: Export from Base44 Dashboard
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-blue-800">
                      <li>Go to Base44 Dashboard → Code tab</li>
                      <li>Click &quot;Export Project&quot;</li>
                      <li>Download the complete source code as .zip</li>
                      <li>Extract and follow setup instructions above</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      🔗 Option 2: Clone from GitHub (if connected)
                    </h4>
                    <div className="space-y-3">
                      <p className="text-green-800">If your Base44 project is connected to GitHub:</p>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                        <code>git clone https://github.com/yourusername/joltcab-complete.git</code>
                      </pre>
                    </div>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      📝 Option 3: Manual Recreation
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-purple-800">
                      <li>Copy all code from this documentation</li>
                      <li>Create project structure locally following the structure above</li>
                      <li>Copy each file's content from the Base44 editor</li>
                      <li>Set up environment variables</li>
                      <li>Run setup commands</li>
                    </ol>
                  </div>
                </div>

                <div className="border-t-2 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">What You&apos;ll Get:</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <Server className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Backend</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>✓ 80+ Deno functions</li>
                        <li>✓ Complete API logic</li>
                        <li>✓ Config files</li>
                        <li>✓ Deploy scripts</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <FileCode className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Frontend</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>✓ 70+ React pages</li>
                        <li>✓ 100+ components</li>
                        <li>✓ Full UI library</li>
                        <li>✓ PWA ready</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <Smartphone className="w-8 h-8 text-purple-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Mobile</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>✓ React Native setup</li>
                        <li>✓ iOS & Android config</li>
                        <li>✓ Native modules</li>
                        <li>✓ Push notifications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#15B46A] hover:bg-[#0F9456]"
              onClick={() => window.open('https://admin.joltcab.com/', '_blank')}
            >
              <Download className="w-5 h-5 mr-2" />
              Export from Dashboard
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => copyToClipboard(setupInstructions)}
            >
              {copied ? <CheckCircle className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
              Copy Setup Guide
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Need help? Contact support@joltcab.com
          </p>
        </div>
      </div>
    </div>
  );
}