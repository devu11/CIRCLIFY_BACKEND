

import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: String,
  content: String,
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
