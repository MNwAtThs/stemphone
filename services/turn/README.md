# Stemphone TURN Server

This directory contains the configuration for the coturn TURN/STUN server used by Stemphone for WebRTC NAT traversal.

## Configuration

The `turnserver.conf` file contains the coturn server configuration with:

- STUN/TURN server on port 3478
- TLS/DTLS on port 5349  
- Relay ports range: 49152-65535
- Authentication realm: stemphone.local
- Static users for development (use database in production)

## Development Setup

The TURN server runs in Docker via the main docker-compose.yml file in the infra directory.

## Production Setup

For production deployment:

1. **Generate TLS certificates:**
   ```bash
   # Generate self-signed certificate (or use Let's Encrypt)
   openssl req -x509 -newkey rsa:4096 -keyout turn_server_pkey.pem -out turn_server_cert.pem -days 365 -nodes
   ```

2. **Set external IP:**
   Update the `external-ip` setting in turnserver.conf with your server's public IP address.

3. **Use database authentication:**
   Replace static users with database authentication:
   ```bash
   # Create user in turndb
   turnadmin -a -u username -p password -r stemphone.local
   ```

4. **Configure firewall:**
   - Allow TCP/UDP 3478 (STUN/TURN)
   - Allow TCP/UDP 5349 (TLS/DTLS)
   - Allow UDP 49152-65535 (relay ports)

## Testing

Test the TURN server with:

```bash
# Test STUN functionality
stunclient your-server-ip 3478

# Test TURN functionality  
turnutils_uclient -t -u stemphone -w stemphone123 your-server-ip
```

## Monitoring

- Logs are written to `/var/log/turnserver.log`
- CLI interface available on localhost:5766
- Process ID stored in `/var/run/turnserver.pid`

## Security Notes

- Change default passwords in production
- Use proper TLS certificates
- Restrict allowed peer IP ranges as needed
- Consider rate limiting and DDoS protection
- Monitor for abuse and unauthorized usage

