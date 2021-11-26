const Messages = {
  listChatMessages: (store) => {
    return async (req, res) => {
      const { chat_id } = req.body;
      const messages = await store.getChatMessages(chat_id);

      res.json(messages);
    };
  }
};

export default Messages;