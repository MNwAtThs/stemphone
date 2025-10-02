# Stemphone

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0+-orange.svg)](https://tauri.app/)

Interactive iPhone-like kiosk application for the **San Antonio Museum of Science and Technology**. Transforms the existing [stemphone.org](https://stemphone.org) into a robust, user-proof, sandboxed environment for museum visitors.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development
cd apps/web && npm run dev

# Visit http://localhost:3000
```

## 🏗️ Architecture

```
stemphone/
├── apps/
│   ├── web/           # Next.js PWA (iPhone-like interface)
│   └── shell/         # Tauri app (kiosk mode + ESP32 bridge)
├── services/
│   ├── realtime/      # Node.js + Socket.IO
│   └── turn/          # coturn TURN server
└── infra/
    └── docker-compose.yml  # MQTT, services, proxy
```

## ✅ Current Status

- **Phase 0:** ✅ Monorepo foundation and infrastructure
- **Phase 1:** ✅ iPhone-like PWA with Music and Lights apps
- **Auto-Lock:** ✅ Configurable timeout (30sec - 15min)

## 🎯 Key Features

### Web App (PWA)
- iPhone-style lock screen and home interface
- Music app with Howler.js audio engine
- Lights app with ESP32 integration ready
- Auto-lock with configurable timeout
- Offline-first PWA capabilities

### Hardware Integration
- ESP32 LED control via MQTT
- Tauri shell for kiosk deployment
- Cross-platform (Windows/macOS/Linux)

## 🛠️ Development

```bash
# Web app only
npm run dev:web

# All services
npm run dev

# Infrastructure
cd infra && ./setup.sh

# Build for production
npm run build
```

## 🏛️ Museum Deployment

**Hardware Requirements:**
- Intel i3+ CPU, 4GB+ RAM, 32GB+ SSD
- Touchscreen display (1920x1080 recommended)
- Network connection for ESP32 communication

**Security Features:**
- Kiosk mode with system lockdown
- Auto-lock after inactivity
- User-proof interface design
- Comprehensive .gitignore for sensitive data

## 📄 License

Licensed under the Apache License 2.0 - see [LICENSE](LICENSE) file for details.

---

**Ready for museum deployment** 🏛️ | **ESP32 integration ready** 💡 | **PWA installable** 📱