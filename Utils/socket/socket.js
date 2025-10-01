import { Server } from "socket.io";


export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
    perMessageDeflate: { threshold: 1024 }
  });

  io.on("connection", (socket) => {
    console.log("A new user connected", socket.id);


    socket.on("disconnect", (reason) => {
      console.log(`User ${socket.id} disconnected. Reason: ${reason}`);
    });
    // ================= Live Tracking =================

    // ================= Share Device =================
    // socket.on("shared device token", (token) => handleSharedDevice(socket, token));
  });

  return io;
};

