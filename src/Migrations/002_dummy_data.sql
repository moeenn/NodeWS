INSERT INTO chats (room_id)
VALUES 
	("aa01"),
  ("aa02"),
  ("aa03");


INSERT INTO participants (chat_id, user_id)
VALUES 
	(1, 1),
  (1, 2),
  (2, 1),
  (2, 3);
    
INSERT INTO messages (chat_id, sender_id, text)
VALUES 
	(1, 1, "Hello"),
  (1, 1, "How are you?"),
  (1, 2, "Hi"),
  (1, 2, "I am fine"),
  (1, 2, "What is going on?"),
  (2, 3, "I sent over the reports you requested"),
  (2, 1, "You have sent them already. I didn't receive them"),
  (2, 3, "Are you sure? Can you check your inbox again"),
  (2, 1, "Give me a minute"),
  (2, 2, "Yep, they are here");
