class Message {
  constructor(message) {
    if (!this._validate(message)) {
      throw new Error("Invalid message");
    }

    const { chatID, senderID, text } = message;

    this.chatID = chatID;
    this.senderID = senderID;
    this.text = text.trim();
  }

  _validate({ chatID, senderID, text }) {
    const isNum = (n) => n.constructor === Number && !isNaN(parseInt(n));
    const isString = (str) => str.constructor === String && str.trim().length > 0;

    return isNum(chatID) && isNum(senderID) && isString(text);
  }
}

export default Message;
