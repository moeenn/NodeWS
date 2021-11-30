import Model from "./Model.js";

class Participant extends Model {
  constructor(db, table) {
    super(db, table);
  }

  async create(chatID, userID) {
    const query = `
    INSERT INTO participants (chat_id, user_id)
    VALUES (?, ?);
    `;

    const participant = await this.query(query, [chatID, userID]);
    return await this.find(participant.insertId);
  }
}

export default Participant;