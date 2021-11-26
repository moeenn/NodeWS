import { v4 as uuidv4 } from 'uuid';

class Store {
  _db;

  constructor(db) {
    this._db = db;
  }

  close() {
    this._db.disconnect();
  }

  /**
   *  get all chats for a user
   * 
  */
  async getUserChats(userID) {
    const query = `
    SELECT chats.room_id, chats.id from participants
    join chats on participants.chat_id = chats.id
    where participants.user_id = ?;
    `;

    return await this._db.query(query, [userID]);
  }

  /**
   *  get all messages in a chat (room)
   * 
  */
  async getChatMessages(chatID) {
    const query = `
    SELECT * FROM messages
    WHERE chat_id = ?
    ORDER BY sent_time ASC;
    `;

    return await this._db.query(query, [chatID]);
  }

  /**
   *  check if chat between two participants already exists
   *  if chat does not exist, returns false
   *  if chat exists, return chat id
  */
  async isChatInitiated(userA, userB) {
    const query = `
    SELECT chat_id, user_id FROM participants
    WHERE user_id in (?, ?);
    `;

    let results = await this._db.query(query, [userA, userB]);
    const collectRows = (results) => {
      let rows = {};

      for (const result of results) {
        if (!rows[result.chat_id]) rows[result.chat_id] = [];
        rows[result.chat_id].push(result.user_id);
      }

      return rows;
    };

    const matchIDs = (results, a, b) => {
      for (const [chat_id, users] of Object.entries(results)) {
        if (users.includes(a) && users.includes(b)) {
          return chat_id;
        }
      }
      
      return false;
    };

    results = collectRows(results);
    return matchIDs(results, userA, userB);
  }


  /**
   *  register a new chat between two users 
   * 
  */
  async createChat(userA, userB) {
    const create_chat_query = `
    INSERT INTO chats (room_id)
    values (?);
    `;

    const participants_create_query = `
    INSERT INTO participants (chat_id, user_id)
    VALUES
	    (?, ?),
      (?, ?);
    `;

    const chat = await this._db.query(create_chat_query, [uuidv4()]);
    const chatID = chat.insertId;

    await this._db.query(participants_create_query, [chatID, userA, chatID, userB]);
  }
  

  /**
   *  get a single stored message
   * 
  */
  async getMessage(messageID) {
    const query = `
    SELECT * FROM messages
    WHERE id = ?;
    `;

    const [message] = await this._db.query(query, [messageID]);
    return message;
  }

  
  /**
   *  store a sent message
   *  
  */
  async saveMessage(message) {
    const query = `
    INSERT INTO messages (chat_id, sender_id, text)
    VALUES (?, ?, ?);
    `;

    const {chatID, senderID, text} = message;
    const result = await this._db.query(query, [chatID, senderID, text]);

    return await this.getMessage(result.insertId);
  }
}

export default Store;