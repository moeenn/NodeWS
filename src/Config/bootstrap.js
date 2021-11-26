/**
 *  set up environment variables
 *  note: this should always be the first step in this config file
 * 
*/
import { config } from 'dotenv';
config({ path: "./src/.env"});

/**
 *  setup the database and store connection
 * 
*/
import Database from "../Entities/Database.js";
import Chat from "../Models/Chat.js";
import Participant from "../Models/Participant.js";
import Message from "../Models/Message.js";

const db = new Database({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const chat = new Chat(db, 'chats');
const participant = new Participant(db, 'participants');
const message = new Message(db, 'messages');

const models = { chat, participant, message };

export {
  db,
  models,
};