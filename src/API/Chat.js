import { v4 as uuidv4 } from 'uuid';

const Chat = {
  listUserChats: (models) => {
    return async (req, res) => {
      const { user_id } = req.body;

      if (!user_id) {
        res
          .json({ message: "Missing post fields: user_id" })
          .status(400);
        return;
      }

      let chats = await models.chat.getUserChats(user_id);

      for (let i = 0; i < chats.length; i++) {
        chats[i].users = await models.chat.getChatUsers(chats[i].id);
      }

      res.json(chats);
    };
  },

  createChat: (models) => {
    return async (req, res) => {
      const { users } = req.body;

      if (!users) {
        res
          .json({ message: "Missing post field: users" })
          .status(400);

        return;
      }

      // if (models.chat.isChatInitiated(users[0], users[1])) {
      //   res
      //     .json({ message: "Chat between users already exists" })
      //     .status(400);

      //   return;
      // }

      const roomID = uuidv4();
      const chat = await models.chat.create(roomID);

      for (const user of users) {
        await models.participant.create(chat.id, user);
      }

      res
        .json({ message: "Chat created successfully" })
        .status(201);
    };
  },
};

export default Chat;