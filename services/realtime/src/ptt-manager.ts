interface PTTSession {
    socketId: string;
    roomId: string;
    userId: string;
    username: string;
    startTime: Date;
    maxDuration: number; // in milliseconds
    timeoutId?: NodeJS.Timeout;
}

export class PTTManager {
    private activePTT: Map<string, PTTSession> = new Map(); // roomId -> PTTSession
    private pttQueue: Map<string, string[]> = new Map(); // roomId -> socketId[]
    private readonly DEFAULT_MAX_DURATION = 30000; // 30 seconds
    private readonly QUEUE_TIMEOUT = 5000; // 5 seconds to respond to PTT grant

    async requestPTT(socketId: string, roomId: string, userId?: string, username?: string): Promise<boolean> {
        // Check if PTT is already active in this room
        const activeSession = this.activePTT.get(roomId);

        if (activeSession) {
            // If same user, extend the session
            if (activeSession.socketId === socketId) {
                this.extendPTTSession(roomId);
                return true;
            }

            // Add to queue if different user
            this.addToQueue(roomId, socketId);
            return false;
        }

        // Grant PTT immediately if room is free
        return this.grantPTT(socketId, roomId, userId, username);
    }

    private grantPTT(socketId: string, roomId: string, userId?: string, username?: string): boolean {
        const session: PTTSession = {
            socketId,
            roomId,
            userId: userId || socketId,
            username: username || `User-${socketId.substring(0, 8)}`,
            startTime: new Date(),
            maxDuration: this.DEFAULT_MAX_DURATION
        };

        // Set timeout to auto-release PTT
        session.timeoutId = setTimeout(() => {
            console.log(`Auto-releasing PTT for user ${session.username} in room ${roomId} due to timeout`);
            this.releasePTT(socketId, roomId);
        }, session.maxDuration);

        this.activePTT.set(roomId, session);
        console.log(`PTT granted to ${session.username} in room ${roomId}`);

        return true;
    }

    async releasePTT(socketId: string, roomId: string): Promise<boolean> {
        const activeSession = this.activePTT.get(roomId);

        if (!activeSession || activeSession.socketId !== socketId) {
            return false; // Not the active PTT holder
        }

        // Clear timeout
        if (activeSession.timeoutId) {
            clearTimeout(activeSession.timeoutId);
        }

        // Remove active session
        this.activePTT.delete(roomId);

        const duration = Date.now() - activeSession.startTime.getTime();
        console.log(`PTT released by ${activeSession.username} in room ${roomId} after ${duration}ms`);

        // Process queue for next user
        this.processQueue(roomId);

        return true;
    }

    async releaseAllPTT(socketId: string): Promise<void> {
        const roomsToRelease: string[] = [];

        // Find all rooms where this socket has active PTT
        for (const [roomId, session] of this.activePTT.entries()) {
            if (session.socketId === socketId) {
                roomsToRelease.push(roomId);
            }
        }

        // Release PTT in all rooms
        for (const roomId of roomsToRelease) {
            await this.releasePTT(socketId, roomId);
        }

        // Remove from all queues
        for (const [roomId, queue] of this.pttQueue.entries()) {
            const index = queue.indexOf(socketId);
            if (index > -1) {
                queue.splice(index, 1);
                if (queue.length === 0) {
                    this.pttQueue.delete(roomId);
                }
            }
        }
    }

    hasPTT(socketId: string, roomId: string): boolean {
        const activeSession = this.activePTT.get(roomId);
        return activeSession ? activeSession.socketId === socketId : false;
    }

    getActivePTT(roomId: string): PTTSession | null {
        return this.activePTT.get(roomId) || null;
    }

    private addToQueue(roomId: string, socketId: string): void {
        if (!this.pttQueue.has(roomId)) {
            this.pttQueue.set(roomId, []);
        }

        const queue = this.pttQueue.get(roomId)!;
        if (!queue.includes(socketId)) {
            queue.push(socketId);
            console.log(`Added ${socketId} to PTT queue for room ${roomId}. Queue position: ${queue.length}`);
        }
    }

    private processQueue(roomId: string): void {
        const queue = this.pttQueue.get(roomId);
        if (!queue || queue.length === 0) {
            return;
        }

        const nextSocketId = queue.shift()!;

        // Try to grant PTT to next user in queue
        // In a real implementation, you'd emit an event to the socket
        // and wait for confirmation before granting
        console.log(`Processing PTT queue for room ${roomId}, next user: ${nextSocketId}`);

        // For now, auto-grant to next in queue
        // In production, you'd emit 'ptt-offer' and wait for 'ptt-accept'
        setTimeout(() => {
            if (!this.activePTT.has(roomId)) { // Still available
                this.grantPTT(nextSocketId, roomId);
            }
        }, 100);

        // Clean up empty queue
        if (queue.length === 0) {
            this.pttQueue.delete(roomId);
        }
    }

    private extendPTTSession(roomId: string): void {
        const session = this.activePTT.get(roomId);
        if (!session) return;

        // Clear existing timeout
        if (session.timeoutId) {
            clearTimeout(session.timeoutId);
        }

        // Set new timeout
        session.timeoutId = setTimeout(() => {
            console.log(`Auto-releasing extended PTT for user ${session.username} in room ${roomId}`);
            this.releasePTT(session.socketId, roomId);
        }, session.maxDuration);

        console.log(`PTT session extended for ${session.username} in room ${roomId}`);
    }

    // Get PTT statistics
    getPTTStats() {
        return {
            activeRooms: this.activePTT.size,
            queuedRooms: this.pttQueue.size,
            totalQueued: Array.from(this.pttQueue.values()).reduce((sum, queue) => sum + queue.length, 0)
        };
    }

    // Get queue status for a room
    getQueueStatus(roomId: string) {
        const activeSession = this.activePTT.get(roomId);
        const queue = this.pttQueue.get(roomId) || [];

        return {
            active: activeSession ? {
                userId: activeSession.userId,
                username: activeSession.username,
                startTime: activeSession.startTime.toISOString(),
                remainingTime: Math.max(0, activeSession.maxDuration - (Date.now() - activeSession.startTime.getTime()))
            } : null,
            queue: queue.length,
            queuedUsers: queue
        };
    }

    // Force release PTT (admin function)
    forceReleasePTT(roomId: string): boolean {
        const activeSession = this.activePTT.get(roomId);
        if (!activeSession) return false;

        return this.releasePTT(activeSession.socketId, roomId);
    }

    // Set custom PTT duration for a session
    setPTTDuration(roomId: string, durationMs: number): boolean {
        const session = this.activePTT.get(roomId);
        if (!session) return false;

        session.maxDuration = durationMs;

        // Reset timeout with new duration
        if (session.timeoutId) {
            clearTimeout(session.timeoutId);
        }

        const remainingTime = Math.max(0, durationMs - (Date.now() - session.startTime.getTime()));
        session.timeoutId = setTimeout(() => {
            this.releasePTT(session.socketId, roomId);
        }, remainingTime);

        return true;
    }
}

