import mongoose from "mongoose";
const postSchema = mongoose.Schema(
    {
        userId:{
            type: String,
            required: true
        },
        desc: String,
        likes:[],
        comments: [ 
        {
            userId: String, 
            comment: String 
        }
    ],
        image:[String],
        video:String,
    },
    {
        timestamps:true,
    }
);

var PostModel = mongoose.model("Posts",postSchema);
export default PostModel;