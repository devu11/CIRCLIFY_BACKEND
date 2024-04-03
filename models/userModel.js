import mongoose from "mongoose";


const UserSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        
            password: {
                type: String,
                required:true
            },
            firstname:{
                type:String,
               
            },
            lastname:{
                type:String,
              
            },
            blocked: {
                type: Boolean,
                default: false,
              },
            isAdmin:{
                type: Boolean,
                default: false,
            },
            profilePicture: String,
            coverPicture: String,
            about: String,
            livesin: String,
            worksAt: String,
            relationship: String,
            country:String,
            followers: [],
            following: [],
            otp:{
                type: String,
            },
            isVerified: {
                type: Boolean,
                default: false ,
              },
              isPrivate: {
                type: Boolean,
                default: false,
              },
            role: {
                type: String,
                enum: ['user', 'admin'], // Define the roles your application supports
                default: 'user',
             },
           
    },
    {timestamps:true}
)

const UserModel = mongoose.model("Users",UserSchema);
export default UserModel;