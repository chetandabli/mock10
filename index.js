const express = require("express");
const { connection } = require("./configs/db");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const { userRouter } = require("./routes/user");
var jwt = require('jsonwebtoken');

let currentUser = 0;


const httpServer = createServer(app);
const io = new Server(httpServer);

require('dotenv').config()

app.use(express.json())

const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')));

app.use("/api", userRouter);

httpServer.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }
    console.log("app is running...")
})

io.on("connection", (socket) => {
    currentUser++;
    socket.on("welcome", (token)=>{
        let decoded = jwt.verify(token.token, process.env.privateKey);

        
        socket.emit("public", `user ${decoded.username} has joined!`);

        socket.emit("count", currentUser)
    })
    socket.on('disconnect', () => {
        currentUser--;
        socket.emit("count", currentUser)
    });
    socket.on("massage", (data)=>{
        let decoded = jwt.verify(data.token, process.env.privateKey);
        let newmsg = `${decoded.username} :- ${data.msg}`
        io.emit("public", newmsg)
    })
});