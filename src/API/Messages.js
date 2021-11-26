const Messages = {
  listChatMessages: (models) => {
    return async (req, res) => {
      const { chat_id } = req.body;
      const messages = await models.chat.getChatMessages(chat_id);

      res.json(messages);
    };
  }
};

export default Messages;