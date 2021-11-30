import { v4 as uuidv4 } from 'uuid';

const Chat = {
  listUserChats: (models) => {
    return async (req, res) => {
      const { user_id } = req.body;

      if (!user_id) {
        res
          .status(400)
          .json({ message: "Missing post fields: user_id" });

        return;
      }

      let chats = await models.chat.getUserChats(user_id);

      /**
       *  cannot pass async functions to array map callback,
       *  therefore this traditional c-style for loop
      */
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
          .status(400)
          .json({ message: "Missing post field: users" });

        return;
      }

      const [userA, userB] = users;
      const initiated = await models.chat.isChatInitiated(userA, userB); 

      if (initiated) {
        res
          .status(400)
          .json({ message: "Chat between users already exists" });

        return;
      }

      const roomID = uuidv4();
      const chat = await models.chat.create(roomID);

      for (const user of users) {
        await models.participant.create(chat.id, user);
      }

      res
        .status(201)
        .json({ message: "Chat created successfully" });
    };
  },
};

export default Chat;