import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { models } from "./Config/bootstrap.js";
import API from "./API/api.js";

const main = async () => {
  const app = express();

  /**
   *  register required middleware
   * 
  */
  app.use(bodyParser.json())
  app.use(cors());


  /**
   *  register http api endpoints
   * 
  */
  app.post("/api/chats", API.Chat.listUserChats(models));
  app.post("/api/chats/create", API.Chat.createChat(models));
  app.post("/api/messages", API.Messages.listChatMessages(models));


  /**
   *  register web sockets server
   * 
  */
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