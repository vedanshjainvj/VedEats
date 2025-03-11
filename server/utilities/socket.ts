import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: Server;

export const initSocketIO = (httpServer: HTTPServer): void => {
    io = new Server(httpServer, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};

export const notifyOrderUpdate = (updatedOrder: any): void => {
    if (!io) {
        console.error('Socket.IO not initialized');
        return;
    }
    io.emit('order-updated', updatedOrder);
};
