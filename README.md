# Stemphone

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0+-orange.svg)](https://tauri.app/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

An interactive iPhone-like kiosk application designed for the **San Antonio Museum of Science and Technology**. This project transforms the existing [stemphone.org](https://stemphone.org) WordPress site into a robust, user-proof, sandboxed environment that can handle hundreds of daily interactions from museum visitors of all ages.

## 🎯 Project Purpose

Stemphone replaces the current WordPress-based stemphone.org with a modern, interactive kiosk system that:

- **Museum-Ready**: Designed for high-traffic public use at SAMSAT
- **User-Proof**: Sandboxed environment prevents system access or damage
- **iPhone Experience**: Replicates the familiar iPhone interface with app tiles
- **Hardware Integration**: Communicates with ESP32-controlled LED lights
- **Cross-Platform**: Runs on Windows, macOS, and Linux kiosk systems
- **Maintainable**: Modern tech stack for easy updates and feature additions

## Phase 0 — Foundations ✅

This repository provides a single place to build the web app, shell app, and on-prem services for Stemphone.

## Architecture

```
stemphone/
├── apps/
│   ├── web/           # Next.js PWA (phone UI + apps)
│   └── shell/         # Tauri app (loads web, adds kiosk + MQTT bridge)
├── services/
│   ├── realtime/      # Node + Socket.IO (rooms, presence, PTT mutex)
│   └── turn/          # coturn config (for WebRTC)
└── infra/
    └── docker-compose.yml  # mosquitto (MQTT), realtime, reverse-proxy
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- Rust (for Tauri shell app)

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start infrastructure services:**
   ```bash
   cd infra
   ./setup.sh
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1: Web app
   npm run dev:web
   
   # Terminal 2: Realtime service  
   npm run dev:realtime
   
   # Terminal 3: Shell app (optional)
   npm run dev:shell
   ```

4. **Access the applications:**
   - Web App: http://localhost:3000
   - Realtime API: http://localhost:3001
   - MQTT Broker: mqtt://localhost:1883
   - TURN Server: turn://localhost:3478

## 🛠️ Technology Stack & Architecture Decisions

### Why This Tech Stack?

**Tauri + Next.js Hybrid Approach**
- **Tauri Shell**: Provides native desktop app with system-level control for kiosk mode
- **Next.js Web App**: Modern React framework for rapid UI development and maintenance
- **TypeScript**: Type safety reduces bugs in high-traffic public environment
- **Tailwind CSS**: Utility-first CSS for consistent, responsive iPhone-like UI

**Key Advantages for Museum Deployment:**

1. **Security & Sandboxing**
   - Tauri's Rust backend provides memory safety and security
   - Web content runs in isolated context
   - No direct system access for users
   - Automatic updates without system compromise

2. **Cross-Platform Compatibility**
   - Single codebase runs on Windows, macOS, Linux
   - Consistent experience across different kiosk hardware
   - Easy deployment to various museum setups

3. **Hardware Integration**
   - MQTT broker for ESP32 LED light communication
   - Real-time WebSocket connections for instant feedback
   - Modular service architecture for easy hardware additions

4. **Maintainability**
   - Modern web technologies familiar to developers
   - Component-based architecture for easy app additions
   - Docker containerization for consistent deployments
   - Comprehensive logging and monitoring capabilities

### Alternative Approaches Considered

| Approach | Pros | Cons | Museum Suitability |
|----------|------|------|-------------------|
| **Pure Web App** | Easy updates, familiar tech | Requires browser, less secure | ❌ Browser access risk |
| **Electron App** | Web tech, desktop app | Large bundle, security concerns | ⚠️ Potential vulnerabilities |
| **Native Apps** | Maximum performance | Platform-specific code | ❌ High maintenance cost |
| **Tauri Hybrid** ✅ | Secure, small bundle, web tech | Newer ecosystem | ✅ Perfect for kiosks |

## 🚀 Quick Start & Deployment

### For Development

1. **Prerequisites**
   ```bash
   # Required software
   - Node.js 18+ and npm 9+
   - Rust (for Tauri)
   - Docker & Docker Compose
   ```

2. **Clone and Setup**
   ```bash
   git clone https://github.com/your-org/stemphone.git
   cd stemphone
   npm install
   ```

3. **Start Development Environment**
   ```bash
   # Start infrastructure services
   cd infra && ./setup.sh
   
   # Start development servers (in separate terminals)
   npm run dev:web      # Next.js web app
   npm run dev:realtime # Backend services
   npm run dev:shell    # Tauri desktop app
   ```

### For Museum Kiosk Deployment

1. **Production Build**
   ```bash
   # Build all applications
   npm run build
   
   # Build Tauri app for target platform
   cd apps/shell
   npm run tauri build -- --target x86_64-pc-windows-msvc  # Windows
   npm run tauri build -- --target x86_64-apple-darwin     # macOS
   npm run tauri build -- --target x86_64-unknown-linux-gnu # Linux
   ```

2. **Kiosk Configuration**
   ```bash
   # The Tauri app automatically:
   - Launches in fullscreen kiosk mode
   - Disables system shortcuts (Alt+Tab, etc.)
   - Prevents access to underlying OS
   - Connects to ESP32 via MQTT
   ```

3. **Hardware Setup**
   ```bash
   # ESP32 Configuration
   - Flash ESP32 with MQTT client firmware
   - Connect to local network
   - Configure MQTT broker connection
   - LED patterns controlled via stemphone/lights/* topics
   ```

## Applications

### Web App (`apps/web/`)

Next.js PWA with phone-like UI featuring:
- Progressive Web App capabilities
- Mobile-first design with phone UI
- Real-time communication features
- Offline support

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, PWA

### Shell App (`apps/shell/`)

Tauri desktop application that:
- Loads the web app in kiosk mode
- Provides MQTT bridge functionality
- Enables fullscreen/kiosk deployment
- Handles system-level integrations

**Tech Stack:** Tauri, TypeScript, Rust

### Realtime Service (`services/realtime/`)

Node.js service providing:
- Socket.IO real-time communication
- Room management and presence
- Push-to-Talk (PTT) mutex system
- MQTT bridge integration
- WebRTC signaling support

**Tech Stack:** Node.js, TypeScript, Socket.IO, MQTT

### TURN Service (`services/turn/`)

coturn TURN/STUN server for:
- WebRTC NAT traversal
- Peer-to-peer connection establishment
- Audio/video call support

**Tech Stack:** coturn

## Infrastructure

### Docker Services

The `infra/docker-compose.yml` provides:

- **Mosquitto MQTT Broker** (port 1883, 9001)
- **Realtime Service** (port 3001)
- **coturn TURN Server** (port 3478, 5349)
- **Nginx Reverse Proxy** (port 80, 443) - optional
- **Redis Cache** (port 6379) - optional
- **PostgreSQL Database** (port 5432) - optional

### Service Management

```bash
# Start all services
npm run infra:up

# Stop all services  
npm run infra:down

# View logs
npm run infra:logs

# Start with optional services
docker-compose --profile proxy --profile cache up -d
```

## Development

### Workspace Commands

```bash
# Install all dependencies
npm install

# Development mode (web + realtime)
npm run dev

# Build all applications
npm run build

# Individual app commands
npm run dev:web        # Start web app dev server
npm run dev:shell      # Start shell app dev server  
npm run dev:realtime   # Start realtime service dev server
```

### Project Structure

```
stemphone/
├── apps/
│   ├── web/                    # Next.js PWA
│   │   ├── src/app/           # App router pages
│   │   ├── public/            # Static assets
│   │   └── package.json       # Web app dependencies
│   └── shell/                 # Tauri app
│       ├── src/               # Frontend TypeScript
│       ├── src-tauri/         # Rust backend
│       └── package.json       # Shell app dependencies
├── services/
│   ├── realtime/              # Socket.IO service
│   │   ├── src/               # TypeScript source
│   │   ├── Dockerfile         # Container build
│   │   └── package.json       # Service dependencies
│   └── turn/                  # TURN server config
│       ├── turnserver.conf    # coturn configuration
│       └── README.md          # Setup instructions
├── infra/                     # Infrastructure
│   ├── docker-compose.yml     # Service orchestration
│   ├── mosquitto/             # MQTT broker config
│   ├── nginx/                 # Reverse proxy config
│   └── setup.sh              # Infrastructure setup
└── package.json              # Workspace configuration
```

## Features

### Real-time Communication
- Socket.IO for instant messaging
- Room-based communication
- User presence tracking
- Push-to-Talk (PTT) system with mutex

### MQTT Integration
- Bi-directional MQTT bridge
- Topic-based messaging
- Device integration support
- System event publishing

### WebRTC Support
- Peer-to-peer audio/video calls
- TURN server for NAT traversal
- Signaling through Socket.IO
- Mobile and desktop support

### Progressive Web App
- Offline functionality
- Mobile app-like experience
- Push notifications (planned)
- Install to home screen

### Museum Kiosk Features
- **Fullscreen kiosk mode** with no system access
- **ESP32 LED integration** via MQTT communication
- **User-proof interface** designed for public use
- **Cross-platform deployment** (Windows/macOS/Linux)
- **Automatic recovery** from crashes or errors
- **Remote monitoring** and maintenance capabilities

## Configuration

### Environment Variables

**Realtime Service:**
```bash
PORT=3001
CORS_ORIGIN=http://localhost:3000
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=stemphone
MQTT_PASSWORD=stemphone123
```

**MQTT Broker:**
- Default users: `stemphone:stemphone123`, `guest:guest123`
- WebSocket support on port 9001
- ACL-based access control

**TURN Server:**
- STUN/TURN on port 3478
- TLS/DTLS on port 5349
- Relay ports: 49152-65535

**ESP32 Integration:**
```bash
# MQTT Topics for LED Control
stemphone/lights/status     # LED status updates
stemphone/lights/pattern    # Set LED patterns
stemphone/lights/color      # Change LED colors
stemphone/lights/brightness # Adjust brightness
```

## Security

### Development
- Self-signed SSL certificates
- Default passwords (change in production)
- Local network access only

### Production Recommendations
- Use proper SSL certificates
- Change all default passwords
- Configure firewall rules
- Enable rate limiting
- Use database authentication
- Monitor for abuse

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- **Next.js**: MIT License
- **Tauri**: Apache License 2.0 / MIT License
- **Socket.IO**: MIT License
- **Eclipse Mosquitto**: EPL-2.0 / EDL-1.0
- **coturn**: BSD 3-Clause License

## 🏛️ Museum Deployment Notes

### San Antonio Museum of Science and Technology

This software is specifically designed for deployment at SAMSAT with the following considerations:

- **High Traffic**: Handles hundreds of daily interactions
- **Age Range**: Designed for users from children to adults
- **Durability**: Robust error handling and automatic recovery
- **Maintenance**: Remote monitoring and easy updates
- **Hardware**: Integrates with custom ESP32 LED lighting system

### Kiosk Hardware Requirements

**Minimum Specifications:**
- **CPU**: Intel i3 or AMD Ryzen 3 (or equivalent)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 32GB SSD minimum
- **Display**: 1920x1080 touchscreen recommended
- **Network**: Ethernet or WiFi connection
- **USB**: For ESP32 connection (optional, can use WiFi)

**Recommended Setup:**
- Dedicated kiosk PC with touchscreen
- Ethernet connection for reliability
- UPS for power protection
- Physical security enclosure
- Remote management capabilities

## Support

For questions and support, please [create an issue](https://github.com/your-org/stemphone/issues).

---

**Status:** Phase 0 Complete ✅  
**Next:** Phase 1 - Core Communication Features
