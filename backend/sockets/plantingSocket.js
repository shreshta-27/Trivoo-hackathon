import PlantingSession from '../Models/PlantingSession.js';

export default function plantingSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected to planting namespace');

        socket.on('join_session', async ({ sessionId, userId }) => {
            try {
                socket.join(sessionId);
                const session = await PlantingSession.findByIdAndUpdate(
                    sessionId,
                    { $addToSet: { participants: { user: userId } } },
                    { new: true }
                ).populate('participants.user', 'name avatar');

                io.to(sessionId).emit('session_update', session);
                socket.emit('joined', { success: true });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('update_plant_count', async ({ sessionId, count }) => {
            try {
                const session = await PlantingSession.findByIdAndUpdate(
                    sessionId,
                    { $inc: { plantedTrees: count } },
                    { new: true }
                );

                if (session.plantedTrees >= session.targetTrees) {
                    session.status = 'completed';
                    await session.save();
                    io.to(sessionId).emit('drive_completed', session);
                }

                io.to(sessionId).emit('progress_update', {
                    planted: session.plantedTrees,
                    target: session.targetTrees
                });
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from planting namespace');
        });
    });
}
