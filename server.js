// <--------------------------------------------- Database connect --------------------------------------------------->
require("./src/database/init");

const { app } = require("./app");
const colors = require('colors');
colors.enable();

// <--------------------------------------------- Express App setup --------------------------------------------------->
const PORT = process.env.PORT || 5000  // Each worker listens on a unique port
const server = app.listen(PORT, async () => {
    console.log(`Server is running on PORT: ${PORT} url on mode ${process.env.NODE_ENV}`.yellow.bold)
});


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
