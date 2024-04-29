// <------------------------------------------------ load env vars ---------------------------------------------------->
if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv");
    dotenv.config({ path: "src/config/env/config.env" });
} else {
    require("dotenv").config();
}

const cluster = require("cluster");
const totalCPUs = process.env.TOTAL_CPU || require("os").cpus().length;


if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
    // // Node.js < 16.0.0
    cluster.setupMaster({
        serialization: "advanced",
    });

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        let worker = cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });

} else {
    const server = require("./server");
    
    // Access the server instance
    server.on("listening", () => {
        console.log(`Cluster ==========> Server ${process.pid} is running`);
    });
}