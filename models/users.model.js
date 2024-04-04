import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatarURL: {
    type: String,
    required: true
  },
  following: {
    type: [String], // Array of user IDs
    default: [],
    set: ids => [...new Set(ids)] // Ensure only unique IDs
  }
},{
  timestamps: true.valueOf()
});

const User = mongoose.model('User', userSchema);

export default User;