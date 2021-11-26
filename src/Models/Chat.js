import Model from "./Model.js";

class Chat extends Model {
  constructor(db, table) {
    super(db, table);
  }

  /**
   *  create a new chat
   * 
  */
  async create(roomID) {
    const query = `
    INSERT INTO chats (room_id)
    values (?);
    `;

    const chat = await this.query(query, [roomID]); 
    return await this.find(chat.insertId);
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

    return await this.query(query, [userID]);
  }

  /**
   *  get users in a chat
   * 
  */
  async getChatUsers(chatID) {
    const query = `
      SELECT DISTINCT(user_id) FROM participants
      WHERE chat_id = ?;
      `;

    return await this.query(query, [chatID]);
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

    return await this.query(query, [chatID]);
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

    let results = await this.query(query, [userA, userB]);
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
}

export default Chat;