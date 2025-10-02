interface UserPresence {
    socketId: string;
    userId: string;
    username: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    lastSeen: Date;
    metadata?: any;
}

export class PresenceManager {
    private presenceMap: Map<string, UserPresence> = new Map(); // socketId -> UserPresence
    private userSocketMap: Map<string, string> = new Map(); // userId -> socketId

    async setUserOnline(socketId: string, userData: any): Promise<void> {
        const presence: UserPresence = {
            socketId,
            userId: userData.id,
            username: userData.username,
            status: 'online',
            lastSeen: new Date(),
            metadata: userData.metadata
        };

        this.presenceMap.set(socketId, presence);
        this.userSocketMap.set(userData.id, socketId);

        console.log(`User ${userData.username} (${userData.id}) is now online`);
    }

    async setUserOffline(socketId: string): Promise<void> {
        const presence = this.presenceMap.get(socketId);
        if (presence) {
            presence.status = 'offline';
            presence.lastSeen = new Date();

            // Remove from active maps after a delay to allow for reconnections
            setTimeout(() => {
                this.presenceMap.delete(socketId);
                this.userSocketMap.delete(presence.userId);
            }, 30000); // 30 seconds grace period

            console.log(`User ${presence.username} (${presence.userId}) is now offline`);
        }
    }

    async updateUserStatus(socketId: string, status: 'online' | 'away' | 'busy'): Promise<void> {
        const presence = this.presenceMap.get(socketId);
        if (presence) {
            presence.status = status;
            presence.lastSeen = new Date();
            console.log(`User ${presence.username} status updated to ${status}`);
        }
    }

    async updateUserMetadata(socketId: string, metadata: any): Promise<void> {
        const presence = this.presenceMap.get(socketId);
        if (presence) {
            presence.metadata = { ...presence.metadata, ...metadata };
            presence.lastSeen = new Date();
        }
    }

    getUserPresence(socketId: string): UserPresence | null {
        return this.presenceMap.get(socketId) || null;
    }

    getUserPresenceByUserId(userId: string): UserPresence | null {
        const socketId = this.userSocketMap.get(userId);
        return socketId ? this.presenceMap.get(socketId) || null : null;
    }

    getAllOnlineUsers(): UserPresence[] {
        return Array.from(this.presenceMap.values()).filter(
            presence => presence.status !== 'offline'
        );
    }

    getOnlineUserCount(): number {
        return Array.from(this.presenceMap.values()).filter(
            presence => presence.status !== 'offline'
        ).length;
    }

    isUserOnline(userId: string): boolean {
        const presence = this.getUserPresenceByUserId(userId);
        return presence ? presence.status !== 'offline' : false;
    }

    getSocketIdByUserId(userId: string): string | null {
        return this.userSocketMap.get(userId) || null;
    }

    // Heartbeat mechanism to detect inactive users
    startHeartbeat(intervalMs: number = 60000): void {
        setInterval(() => {
            const now = new Date();
            const staleThreshold = 5 * 60 * 1000; // 5 minutes

            for (const [socketId, presence] of this.presenceMap.entries()) {
                const timeSinceLastSeen = now.getTime() - presence.lastSeen.getTime();

                if (timeSinceLastSeen > staleThreshold && presence.status !== 'offline') {
                    console.log(`Marking user ${presence.username} as away due to inactivity`);
                    presence.status = 'away';
                }
            }
        }, intervalMs);
    }

    // Get presence statistics
    getPresenceStats() {
        const stats = {
            total: this.presenceMap.size,
            online: 0,
            away: 0,
            busy: 0,
            offline: 0
        };

        for (const presence of this.presenceMap.values()) {
            stats[presence.status]++;
        }

        return stats;
    }

    // Clean up old offline users
    cleanupOfflineUsers(olderThanMs: number = 24 * 60 * 60 * 1000): void {
        const cutoffTime = new Date(Date.now() - olderThanMs);

        for (const [socketId, presence] of this.presenceMap.entries()) {
            if (presence.status === 'offline' && presence.lastSeen < cutoffTime) {
                this.presenceMap.delete(socketId);
                this.userSocketMap.delete(presence.userId);
                console.log(`Cleaned up old offline user: ${presence.username}`);
            }
        }
    }
}

