# JoltCab Frontend

React-based frontend application for the JoltCab ride-sharing platform.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

This frontend is configured for deployment on **Vercel**.

**Quick Deploy:**
1. Push to GitHub: `https://github.com/joltcab/frontend`
2. Import project in Vercel
3. Add environment variable: `VITE_API_URL=https://admin.joltcab.com`
4. Deploy!

📖 **Detailed Instructions**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🛠 Tech Stack

- **Framework**: React 18 + Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **UI Components**: Headless UI, Heroicons

## 🏗 Project Structure

```
frontend/
├── public/              # Static assets
│   ├── images/         # App images and logos
│   └── logos/          # Brand logos
├── src/
│   ├── assets/         # React assets
│   ├── components/     # Reusable components
│   │   └── layout/    # Layout components (Navbar, Footer)
│   ├── features/       # Feature-based modules
│   │   ├── admin/     # Admin dashboard
│   │   ├── user/      # User dashboard
│   │   ├── driver/    # Driver dashboard
│   │   ├── partner/   # Partner dashboard
│   │   ├── corporate/ # Corporate dashboard
│   │   ├── dispatcher/# Dispatcher dashboard
│   │   ├── hotel/     # Hotel dashboard
│   │   └── landing/   # Landing & auth pages
│   ├── routes/         # Route configuration
│   ├── services/       # API & Socket services
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   └── main.jsx        # App entry point
├── .env.example        # Example environment variables
├── .env.production     # Production environment variables
├── vercel.json         # Vercel configuration
└── vite.config.js      # Vite configuration
```

## 🌐 Environment Variables

Create a `.env` file for local development:

```bash
VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=development
```

For production (configured in Vercel):

```bash
VITE_API_URL=https://admin.joltcab.com
VITE_NODE_ENV=production
```

## 🎨 Features

### Implemented Dashboards
- ✅ Landing Page (Uber-style design)
- ✅ Login & Registration
- ✅ Admin Dashboard
- ✅ User Dashboard
- ✅ Driver Dashboard
- ✅ Partner Dashboard
- ✅ Corporate Dashboard
- ✅ Dispatcher Dashboard
- ✅ Hotel Dashboard

### Core Features
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Multi-role authentication
- 🌙 Dark/Light theme support (ready)
- 🌍 Internationalization ready (i18next integration pending)
- 📱 Mobile-first responsive design
- ⚡ Fast page loads with Vite
- 🔄 Real-time updates via Socket.IO

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Related Repositories

- **Backend API**: https://github.com/joltcab/backend
- **Documentation**: See main backend repo for full docs

## 📄 License

Proprietary - JoltCab Platform

## 🤝 Contributing

This is a private project. Contact the team for contribution guidelines.
