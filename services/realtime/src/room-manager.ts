interface Room {
    id: string;
    name: string;
    participants: Set<string>;
    createdAt: Date;
    lastActivity: Date;
}

interface RoomInfo {
    id: string;
    name: string;
    participantCount: number;
    participants: string[];
    createdAt: string;
    lastActivity: string;
}

export class RoomManager {
    private rooms: Map<string, Room> = new Map();
    private userRooms: Map<string, Set<string>> = new Map(); // socketId -> roomIds

    async joinRoom(socketId: string, roomId: string): Promise<void> {
        // Create room if it doesn't exist
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
                id: roomId,
                name: `Room ${roomId}`,
                participants: new Set(),
                createdAt: new Date(),
                lastActivity: new Date()
            });
        }

        const room = this.rooms.get(roomId)!;
        room.participants.add(socketId);
        room.lastActivity = new Date();

        // Track user's rooms
        if (!this.userRooms.has(socketId)) {
            this.userRooms.set(socketId, new Set());
        }
        this.userRooms.get(socketId)!.add(roomId);

        console.log(`Socket ${socketId} joined room ${roomId}. Room now has ${room.participants.size} participants.`);
    }

    async leaveRoom(socketId: string, roomId: string): Promise<void> {
        const room = this.rooms.get(roomId);
        if (room) {
            room.participants.delete(socketId);
            room.lastActivity = new Date();

            // If room is empty, consider removing it after a timeout
            if (room.participants.size === 0) {
                setTimeout(() => {
                    const currentRoom = this.rooms.get(roomId);
                    if (currentRoom && currentRoom.participants.size === 0) {
                        this.rooms.delete(roomId);
                        console.log(`Removed empty room: ${roomId}`);
                    }
                }, 60000); // Remove after 1 minute of being empty
            }
        }

        // Remove from user's rooms
        const userRooms = this.userRooms.get(socketId);
        if (userRooms) {
            userRooms.delete(roomId);
            if (userRooms.size === 0) {
                this.userRooms.delete(socketId);
            }
        }

        console.log(`Socket ${socketId} left room ${roomId}`);
    }

    async leaveAllRooms(socketId: string): Promise<void> {
        const userRooms = this.userRooms.get(socketId);
        if (userRooms) {
            const roomIds = Array.from(userRooms);
            for (const roomId of roomIds) {
                await this.leaveRoom(socketId, roomId);
            }
        }
    }

    async getRoomInfo(roomId: string): Promise<RoomInfo | null> {
        const room = this.rooms.get(roomId);
        if (!room) {
            return null;
        }

        return {
            id: room.id,
            name: room.name,
            participantCount: room.participants.size,
            participants: Array.from(room.participants),
            createdAt: room.createdAt.toISOString(),
            lastActivity: room.lastActivity.toISOString()
        };
    }

    async getAllRooms(): Promise<RoomInfo[]> {
        const roomInfos: RoomInfo[] = [];

        for (const room of this.rooms.values()) {
            roomInfos.push({
                id: room.id,
                name: room.name,
                participantCount: room.participants.size,
                participants: Array.from(room.participants),
                createdAt: room.createdAt.toISOString(),
                lastActivity: room.lastActivity.toISOString()
            });
        }

        return roomInfos;
    }

    async getUserRooms(socketId: string): Promise<string[]> {
        const userRooms = this.userRooms.get(socketId);
        return userRooms ? Array.from(userRooms) : [];
    }

    isUserInRoom(socketId: string, roomId: string): boolean {
        const room = this.rooms.get(roomId);
        return room ? room.participants.has(socketId) : false;
    }

    getRoomParticipants(roomId: string): string[] {
        const room = this.rooms.get(roomId);
        return room ? Array.from(room.participants) : [];
    }

    getRoomCount(): number {
        return this.rooms.size;
    }

    getTotalParticipants(): number {
        let total = 0;
        for (const room of this.rooms.values()) {
            total += room.participants.size;
        }
        return total;
    }
}

