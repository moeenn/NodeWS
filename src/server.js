import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { store } from "./config.js";

const main = async () => {

  const message = await store.saveMessage({chatID: 3, senderID: 40, text: "This is sample message"});
  console.log(message);

  store.close();

  return;
  const app = express();
  app.use(cors());

  console.log("Starting server on port", process.env.SERVER_PORT);
  const server = app.listen(process.env.SERVER_PORT);
  const io = new Server(server, {
    cors: {
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
  })

  io.on("connection", (socket) => {
    socket.on("new_message", handleNewMessage(socket));
  });
};

main();

const handleNewMessage = (socket) => {
  return (message) => {
    message.id = uuidv4();

    message.senderID = message.recepientID; // for testing
    message.sentTime = "18:30"; // for testing

    socket.emit('new_message', message);
  };
};