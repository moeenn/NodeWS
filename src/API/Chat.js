const Chat = {
  listUserChats: (store) => {
    return async (req, res) => {
      const { user_id } = req.body;
      let chats = await store.getUserChats(user_id);

      for (let i = 0; i < chats.length; i++) {
        chats[i].users = await store.getChatUsers(chats[i].id);
      }

      res.json(chats);
    };
  },
};

export default Chat;