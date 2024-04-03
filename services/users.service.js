// users.service.js

import User from "../models/users.model.js";
import Post from "../models/posts.model.js";

export default {
  createUser: async ({ id, name, avatarURL }) => {
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = new User({
      id,
      name,
      avatarURL,
      following: [],
    });

    await newUser.save();
    return newUser;
  },

  getListUser: async () => {
    const users = await User.find();
    return users;
  },

  getUserById: async (userId) => {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  updateUser: async (userId, { name, avatarURL }) => {
    const user = await User.findOneAndUpdate({ id: userId }, { name, avatarURL }, { new: true });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  getUserFeed: async (userId) => {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const posts = await Post.find({ userId: userId }).sort({ time: -1 });
    return posts;
  },

  createPost: async (userId, { text }) => {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const newPost = new Post({ userId: userId, text, time: new Date() });
    await newPost.save();
    return newPost;
  },

  addFollow: async (userId, { id }) => {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.following.includes(id)) {
      throw new Error('User is already followed');
    }
    user.following.push(id);
    await user.save();
    return user;
  },

  deleteFollow: async (userId, { id }) => {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    user.following = user.following.filter(followId => followId !== id);
    await user.save();
    return user;
  }
};