import Model from "./Model.js";

class Message extends Model {
  constructor(db, table) {
    super(db, table);
  }

  async create(chatID, senderID, text) {
    const query = `
    INSERT INTO messages (chat_id, sender_id, text)
    VALUES (?, ?, ?);
    `;

    const message = await this.query(query, [chatID, senderID, text]); 
    return await this.find(message.insertId);
  }
}

export default Message;