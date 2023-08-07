const messageModel = require("../model/MessageModel");


module.exports = {
  addMessage: async (req, res) => {
    try {
      const { from, to, message } = req.body;

      const data = await messageModel.create({
        message: { text: message },
        users: [from, to],
        sender: from,
      });
      if (data) {
        return res.status(201).json({ msg: "Message added successfully" });
      }
      return res.status(201).json({ msg: "Failed to added message to db" });
    } catch (error) {}
  },
  getMessage: async (req, res,next) => {
     try {
       const { from, to } = req.body;

       const messages = await messageModel
         .find({
           users: {
             $all: [from, to],
           },
         })
         .sort({ updatedAt: 1 });

       const projectedMessages = messages.map((msg) => {
         return {
           fromSelf: msg.sender.toString() === from,
           message: msg.message.text,
         };
       });
       res.json(projectedMessages);
     } catch (ex) {
       next(ex);
     }
  },




};

