const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoutes = require("./routes/UserRoute")
const messageRoute = require("./routes/MessageRoute");
const app = express()
const socket = require("socket.io")
require("dotenv").config()


app.use(cors());
app.use(express.json())

app.use("/api/auth",userRoutes)
app.use("/api/message",messageRoute)

mongoose.connect(process.env.MONGo_URL,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Connected to database')  
}).catch((e)=>{
    console.log(e.message);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
})

const io = socket(server, {
  cors: {
    origin: "https://main.d2bz7gz2kk0tfm.amplifyapp.com",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});