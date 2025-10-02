# Stemphone

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0+-orange.svg)](https://tauri.app/)

Interactive iPhone-like kiosk application for the **San Antonio Museum of Science and Technology**. Transforms the existing [stemphone.org](https://stemphone.org) WordPress site into a robust, user-proof, sandboxed environment designed for hundreds of daily museum visitor interactions.

## 🎯 Project Purpose

Stemphone replaces the current WordPress-based stemphone.org with a modern kiosk system that:

- **Museum-Ready**: Handles high-traffic public use at SAMSAT
- **User-Proof**: Sandboxed environment prevents system access
- **iPhone Experience**: Familiar interface with app tiles and smooth animations
- **Hardware Integration**: Controls ESP32-powered LED lights via MQTT
- **Cross-Platform**: Runs on Windows, macOS, and Linux kiosk systems

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

## ✅ Development Status

### Phase 0 — Foundations ✅ COMPLETE
- Monorepo structure with apps/, services/, and infra/
- Docker infrastructure with MQTT, realtime services
- Development environment ready

### Phase 1 — Web PWA Shell ✅ COMPLETE  
- iPhone-like home screen with lock screen
- Music app with Howler.js audio engine (single-track enforcement)
- Lights app with ESP32 integration ready
- Auto-lock with configurable timeout (30sec - 15min)
- PWA installation and offline capabilities

### Phase 2 — Next Steps 🔄
- Hardware integration with ESP32 via Tauri shell
- Additional museum apps and interactive features

## 🛠️ Technology Stack & Why

### Our Choice: Tauri + Next.js Hybrid

**Why This Combination?**
- **Tauri Shell**: Rust-based security with native system control for kiosk mode
- **Next.js Web App**: Modern React framework for rapid UI development
- **TypeScript**: Type safety reduces bugs in high-traffic public environment
- **Tailwind CSS**: Utility-first CSS for consistent iPhone-like UI

### Architecture Decision Comparison

| Approach | Pros | Cons | Museum Fit |
|----------|------|------|------------|
| **Pure Web App** | Easy updates, familiar tech | Browser access risk, less secure | ❌ Security concerns |
| **Electron App** | Web tech, desktop app | Large bundle, known vulnerabilities | ⚠️ Security risks |
| **Native Apps** | Maximum performance | Platform-specific code, high maintenance | ❌ Too complex |
| **Tauri Hybrid** ✅ | Secure, small bundle, web tech | Newer ecosystem | ✅ Perfect for kiosks |

### Key Advantages for SAMSAT

1. **Security & Sandboxing**
   - Tauri's Rust backend provides memory safety
   - Web content runs in isolated context
   - No direct system access for users
   - Automatic updates without system compromise

2. **Cross-Platform Deployment**
   - Single codebase for Windows, macOS, Linux
   - Consistent experience across different kiosk hardware
   - Easy deployment to various museum setups

3. **Hardware Integration**
   - MQTT broker for ESP32 LED communication
   - Real-time WebSocket connections
   - Modular architecture for future hardware additions

4. **Maintainability**
   - Modern web technologies familiar to developers
   - Component-based architecture for easy app additions
   - Docker containerization for consistent deployments

## 🎯 Key Features

### Web App (PWA) - Phase 1 Complete ✅
- **Lock Screen**: Elegant entry point with real-time clock and museum branding
- **Home Screen**: iPhone-style 4x2 app grid with large touch targets
- **Music App**: Howler.js audio engine with single-track enforcement
- **Lights App**: ESP32 LED control with 8 colors + 4 preset modes
- **Auto-Lock**: Configurable timeout (30sec-15min) with activity detection
- **Settings**: Full configuration interface for auto-lock and system info
- **PWA Ready**: Installable, offline-first, standalone mode

### Hardware & Infrastructure
- **ESP32 Integration**: MQTT communication for LED light control
- **Kiosk Mode**: Tauri shell for secure fullscreen deployment
- **Real-time Services**: Socket.IO for communication, presence, PTT
- **TURN Server**: WebRTC support for future voice/video features
- **Docker Infrastructure**: MQTT broker, services, reverse proxy

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

### Hardware Requirements
- **CPU**: Intel i3+ or AMD Ryzen 3+
- **RAM**: 4GB minimum, 8GB recommended  
- **Storage**: 32GB SSD minimum
- **Display**: 1920x1080 touchscreen
- **Network**: Ethernet or WiFi for ESP32 communication

### Security & Kiosk Features
- **Auto-lock**: Returns to lock screen after inactivity
- **Fullscreen mode**: No access to underlying OS
- **User-proof design**: Large touch targets, simple navigation
- **System lockdown**: Disables shortcuts and system access
- **Remote monitoring**: Health checks and logging

### ESP32 LED Integration
```bash
# MQTT Topics for LED Control
stemphone/lights/scene      # Set color scenes (red, blue, etc.)
stemphone/lights/brightness # Adjust brightness (0-100%)
stemphone/lights/mode       # Preset modes (party, relax, focus)
```

## 🧪 Testing

1. **Development**: `npm run dev:web` → http://localhost:3000
2. **PWA Install**: Look for install icon in browser address bar
3. **Auto-Lock**: Go to Settings → Configure timeout → Test inactivity
4. **ESP32 Commands**: Check browser console in Lights app for MQTT commands

## 📄 License

Licensed under the Apache License 2.0 - see [LICENSE](LICENSE) file for details.

---

**Ready for museum deployment** 🏛️ | **ESP32 integration ready** 💡 | **PWA installable** 📱