import dotenv from "dotenv";
dotenv.config();
import http from "http"
import app from "./src/app.js";
import connectToDb from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);

initSocket(httpServer)

connectToDb();

httpServer.listen(3000, () => {
  console.log("Server is running");
});

