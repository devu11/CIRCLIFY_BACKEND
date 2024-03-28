import ChatModel from "../models/chatModel.js";

export const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Check if a chat between the sender and receiver already exists
    const existingChat = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // If no existing chat, create a new one
    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });

    const result = await newChat.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating chat: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const userChats = async(req,res)=>{

try {

    const chat = await ChatModel.find({
        members: {$in : [req.params.userId]},
    })
res.status(200).json(chat)
    
} catch (error) {
    res.status(500).json(error)
}

}

export const findChat= async(req,res)=>{
    try {
         const chat  = await ChatModel.findOne({
            members: {$all : [req.params.firstId, req.params.secondId]}
         })
res.status(200).json(chat)
        
    } catch (error) {
        res.status(500).json(error)
    }

}