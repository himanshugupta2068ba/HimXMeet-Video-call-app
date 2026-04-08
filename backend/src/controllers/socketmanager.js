import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                    return;
                }
                callback(new Error("Not allowed by Socket.IO CORS"));
            },
            methods: ["GET", "POST"],
            credentials: true
        }
    }); //io stand for socket


    io.on("connection", (socket) => {

        console.log("something connected");
        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            if (messages[path] === undefined) {
                messages[path] = [];
            }

            connections[path].push(socket.id);
            timeOnline[socket.id] = Date.now();

            // Replay previous chat to the user that just joined.
            messages[path].forEach((message) => {
                io.to(socket.id).emit(
                    "chat-message",
                    message.data,
                    message.sender,
                    message["socket-id-sender"]
                );
            });

            // Notify everyone in the room, including this user.
            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }
        })


        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on(("chat-message"), (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {

                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ["", false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }
                messages[matchingRoom].push({
                    'data': data,
                    'sender': sender,
                    'socket-id-sender': socket.id
                });

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id);
                })
            }


        })
        socket.on(("disconnect"), () => {
            delete timeOnline[socket.id];

            for (const [roomKey, roomClients] of Object.entries(connections)) {
                const index = roomClients.indexOf(socket.id);
                if (index === -1) {
                    continue;
                }

                roomClients.splice(index, 1);

                roomClients.forEach((clientId) => {
                    io.to(clientId).emit("user-disconnected", socket.id);
                    io.to(clientId).emit("user-left", socket.id);
                });

                if (roomClients.length === 0) {
                    delete connections[roomKey];
                    delete messages[roomKey];
                }

                break;
            }
        })


    })
    return io;
}
export default connectToSocket;