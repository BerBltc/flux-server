import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.send("Flux Server Çalışıyor");
});

// Kullanıcı bağlandığında
io.on("connection", (socket) => {
    console.log("Yeni kullanıcı bağlandı:", socket.id);

    // Mesajlaşma
    socket.on("message", (data) => {
        io.emit("message", data);
    });

    // WebRTC — ses & görüntü
    socket.on("webrtc-offer", (data) => {
        socket.broadcast.emit("webrtc-offer", data);
    });

    socket.on("webrtc-answer", (data) => {
        socket.broadcast.emit("webrtc-answer", data);
    });

    socket.on("webrtc-ice-candidate", (data) => {
        socket.broadcast.emit("webrtc-ice-candidate", data);
    });

    socket.on("disconnect", () => {
        console.log("Kullanıcı çıktı:", socket.id);
    });
});

httpServer.listen(10000, () => {
    console.log("Server 10000 portunda çalışıyor");
});
