import mqtt from 'mqtt';

export class MQTTBridge {
    private client: mqtt.MqttClient | null = null;
    private connected = false;

    async initialize() {
        const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
        const options: mqtt.IClientOptions = {
            clientId: `stemphone-realtime-${Date.now()}`,
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            reconnectPeriod: 5000,
            connectTimeout: 30000,
        };

        try {
            this.client = mqtt.connect(brokerUrl, options);

            this.client.on('connect', () => {
                console.log('Connected to MQTT broker');
                this.connected = true;

                // Subscribe to relevant topics
                this.client?.subscribe('stemphone/+/+', (err) => {
                    if (err) {
                        console.error('Failed to subscribe to MQTT topics:', err);
                    } else {
                        console.log('Subscribed to MQTT topics');
                    }
                });
            });

            this.client.on('message', (topic, message) => {
                try {
                    const payload = JSON.parse(message.toString());
                    console.log(`MQTT message received on ${topic}:`, payload);

                    // Handle different message types
                    this.handleMQTTMessage(topic, payload);
                } catch (error) {
                    console.error('Failed to parse MQTT message:', error);
                }
            });

            this.client.on('error', (error) => {
                console.error('MQTT connection error:', error);
                this.connected = false;
            });

            this.client.on('close', () => {
                console.log('MQTT connection closed');
                this.connected = false;
            });

        } catch (error) {
            console.error('Failed to initialize MQTT client:', error);
            throw error;
        }
    }

    private handleMQTTMessage(topic: string, payload: any) {
        // Parse topic structure: stemphone/{roomId}/{messageType}
        const topicParts = topic.split('/');
        if (topicParts.length >= 3 && topicParts[0] === 'stemphone') {
            const roomId = topicParts[1];
            const messageType = topicParts[2];

            // Forward to appropriate handlers based on message type
            switch (messageType) {
                case 'ptt':
                    this.handlePTTMessage(roomId, payload);
                    break;
                case 'chat':
                    this.handleChatMessage(roomId, payload);
                    break;
                case 'presence':
                    this.handlePresenceMessage(roomId, payload);
                    break;
                default:
                    console.log(`Unknown MQTT message type: ${messageType}`);
            }
        }
    }

    private handlePTTMessage(roomId: string, payload: any) {
        // Handle PTT messages from MQTT (e.g., from hardware devices)
        console.log(`PTT message for room ${roomId}:`, payload);
    }

    private handleChatMessage(roomId: string, payload: any) {
        // Handle chat messages from MQTT
        console.log(`Chat message for room ${roomId}:`, payload);
    }

    private handlePresenceMessage(roomId: string, payload: any) {
        // Handle presence updates from MQTT
        console.log(`Presence message for room ${roomId}:`, payload);
    }

    publish(topic: string, payload: any): boolean {
        if (!this.connected || !this.client) {
            console.warn('MQTT not connected, cannot publish message');
            return false;
        }

        try {
            this.client.publish(topic, JSON.stringify(payload), { qos: 1 });
            return true;
        } catch (error) {
            console.error('Failed to publish MQTT message:', error);
            return false;
        }
    }

    isConnected(): boolean {
        return this.connected;
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
            this.connected = false;
        }
    }
}

