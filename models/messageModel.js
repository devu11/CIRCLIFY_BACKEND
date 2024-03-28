import mongoose, { mongo } from "mongoose";

const MessageSchema = new mongoose.Schema({

    chatId :{
        type : String
    },
    senderId:{
        type : String
    },
    text:{
        type: String
    },

},
{
    timestamps: true,
})


const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel;