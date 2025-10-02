#!/bin/bash

# Stemphone Infrastructure Setup Script

set -e

echo "🚀 Setting up Stemphone infrastructure..."

# Create MQTT password file
echo "📝 Creating MQTT password file..."
mkdir -p mosquitto/config
echo "stemphone:stemphone123" > mosquitto/config/passwd.tmp
echo "guest:guest123" >> mosquitto/config/passwd.tmp

# Generate MQTT password hashes (requires mosquitto_passwd)
if command -v mosquitto_passwd &> /dev/null; then
    echo "🔐 Generating MQTT password hashes..."
    mosquitto_passwd -U mosquitto/config/passwd.tmp
    mv mosquitto/config/passwd.tmp mosquitto/config/passwd
else
    echo "⚠️  mosquitto_passwd not found. Using plain text passwords (not recommended for production)"
    mv mosquitto/config/passwd.tmp mosquitto/config/passwd
fi

# Set proper permissions
echo "🔒 Setting file permissions..."
chmod 600 mosquitto/config/passwd
chmod 644 mosquitto/config/mosquitto.conf
chmod 644 mosquitto/config/acl.conf

# Create log files
echo "📋 Creating log directories..."
mkdir -p mosquitto/log nginx/logs
touch mosquitto/log/mosquitto.log
chmod 644 mosquitto/log/mosquitto.log

# Generate SSL certificates for development (self-signed)
echo "🔑 Generating development SSL certificates..."
mkdir -p nginx/ssl
if [ ! -f nginx/ssl/stemphone.key ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/stemphone.key \
        -out nginx/ssl/stemphone.crt \
        -subj "/C=US/ST=State/L=City/O=Stemphone/CN=localhost"
    echo "✅ SSL certificates generated"
else
    echo "✅ SSL certificates already exist"
fi

# Create environment files
echo "📄 Creating environment files..."
if [ ! -f ../services/realtime/.env ]; then
    cp ../services/realtime/env.example ../services/realtime/.env
    echo "✅ Created realtime service .env file"
fi

# Build and start services
echo "🐳 Building and starting Docker services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Realtime service is healthy"
else
    echo "❌ Realtime service health check failed"
fi

if nc -z localhost 1883 > /dev/null 2>&1; then
    echo "✅ MQTT broker is running"
else
    echo "❌ MQTT broker is not responding"
fi

if nc -z localhost 3478 > /dev/null 2>&1; then
    echo "✅ TURN server is running"
else
    echo "❌ TURN server is not responding"
fi

echo ""
echo "🎉 Stemphone infrastructure setup complete!"
echo ""
echo "Services running:"
echo "  - MQTT Broker: mqtt://localhost:1883"
echo "  - MQTT WebSocket: ws://localhost:9001"
echo "  - Realtime Service: http://localhost:3001"
echo "  - TURN Server: turn://localhost:3478"
echo "  - Nginx Proxy: http://localhost:80"
echo ""
echo "To stop services: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo "To restart: docker-compose restart"

