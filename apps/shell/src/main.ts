import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

// MQTT Bridge functionality
class MQTTBridge {
  private connected = false;

  async initialize() {
    try {
      // Initialize MQTT connection through Tauri backend
      await invoke("init_mqtt_bridge");
      this.connected = true;
      console.log("MQTT Bridge initialized");

      // Listen for MQTT messages from backend
      await listen("mqtt-message", (event) => {
        console.log("Received MQTT message:", event.payload);
        // Forward to web app via postMessage
        this.forwardToWebApp(event.payload);
      });

    } catch (error) {
      console.error("Failed to initialize MQTT bridge:", error);
    }
  }

  private forwardToWebApp(message: any) {
    // Send message to the web app iframe/window
    const webFrame = document.querySelector('iframe') as HTMLIFrameElement;
    if (webFrame && webFrame.contentWindow) {
      webFrame.contentWindow.postMessage({
        type: 'mqtt-message',
        data: message
      }, '*');
    }
  }

  async publishMessage(topic: string, payload: any) {
    if (!this.connected) {
      console.warn("MQTT not connected");
      return;
    }

    try {
      await invoke("mqtt_publish", { topic, payload: JSON.stringify(payload) });
    } catch (error) {
      console.error("Failed to publish MQTT message:", error);
    }
  }
}

// Kiosk mode functionality
class KioskManager {
  async enableKioskMode() {
    try {
      await invoke("enable_kiosk_mode");
      console.log("Kiosk mode enabled");
    } catch (error) {
      console.error("Failed to enable kiosk mode:", error);
    }
  }

  async disableKioskMode() {
    try {
      await invoke("disable_kiosk_mode");
      console.log("Kiosk mode disabled");
    } catch (error) {
      console.error("Failed to disable kiosk mode:", error);
    }
  }
}

// Initialize the shell app
const mqttBridge = new MQTTBridge();
const kioskManager = new KioskManager();

window.addEventListener("DOMContentLoaded", async () => {
  console.log("Stemphone Shell starting...");

  // Initialize MQTT bridge
  await mqttBridge.initialize();

  // Enable kiosk mode
  await kioskManager.enableKioskMode();

  // Load the web app
  loadWebApp();

  // Listen for messages from web app
  window.addEventListener("message", (event) => {
    if (event.data.type === "mqtt-publish") {
      mqttBridge.publishMessage(event.data.topic, event.data.payload);
    }
  });
});

function loadWebApp() {
  // Create iframe to load the web app
  const iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3000';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';

  document.body.appendChild(iframe);

  // Hide the default content
  const defaultContent = document.querySelector('.container');
  if (defaultContent) {
    (defaultContent as HTMLElement).style.display = 'none';
  }
}
