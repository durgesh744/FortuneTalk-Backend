// <--------------------------------------------- Database connect --------------------------------------------------->
require("./src/database/init");
require('./socket')

const { app } = require("./app");
const colors = require('colors');
colors.enable();

// <--------------------------------------------- Express App setup --------------------------------------------------->
const PORT = process.env.PORT || 5000  // Each worker listens on a unique port
const server = app.listen(PORT, async () => {
    console.log(`Server is running on PORT: ${PORT} url on mode ${process.env.NODE_ENV}`.yellow.bold)
});



// <----------------------------------------------- socket.io -------------------------------------------------------->

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log("Connected to socket.io".blue);

    //connect
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    //send message
    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);
        io.to(user.socketId).emit('getMessage', data)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    //disconnect
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})

// // <---------------------------------------- Handle unhandled Promise rejections -------------------------------------->
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        console.log(
            "Server closed due to unhandled promise rejection".blue
        );
        process.exit(1);
    });
});

module.exports = server; // Export the server instance
