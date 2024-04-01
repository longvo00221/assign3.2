import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import responseHandler from "../handlers/response.handler.js";

const createUser = async (req, res) => {
  const { id, name, avatarURL } = req.body;

  try {
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return responseHandler.badrequest(res, "User already exists");
    }

    const newUser = new User({
      id,
      name,
      avatarURL,
      following: [],
    });

    await newUser.save();
    return responseHandler.created(res, {
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return responseHandler.error(res);
  }
};
const getListUser = async (req, res) => {
  try {
    const users = await User.find();
    return responseHandler.ok(res, users);
  } catch (error) {
    console.error("Error getting user list:", error);
    return responseHandler.error(res);
  }
};
const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ id: userId });

    if (!user) {
      return responseHandler.notfound(res);
    }
    return responseHandler.ok(res, user);
  } catch (error) {
    console.error("Error getting user details:", error);
    return responseHandler.error(res);
  }
};


const updateUser = async (req, res) => {
  const { name, avatarURL } = req.body;
  const userId = req.params.userId;

  try {
    const user = await User.findOneAndUpdate({ id: userId }, { name, avatarURL }, { new: true });
    if (!user) {
      return responseHandler.notfound(res);
    }
    return responseHandler.ok(res, user);
  } catch (error) {
    console.error("Error updating user:", error);
    return responseHandler.error(res);
  }
};

const getUserFeed = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return responseHandler.notfound(res);
    }
    const posts = await Post.find({ userId: userId }).sort({ time: -1 });
    return responseHandler.ok(res, posts);
  } catch (error) {
    console.error("Error getting user feed:", error);
    return responseHandler.error(res);
  }
};

const createPost = async (req, res) => {
  const { text } = req.body;
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return responseHandler.notfound(res);
    }
    const newPost = new Post({ userId: userId, text, time: new Date() });
    await newPost.save();
    return responseHandler.created(res, newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return responseHandler.error(res);
  }
};

const addFollow = async (req, res) => {
  const { id } = req.body;
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return responseHandler.notfound(res);
    }
    user.following.push(id);
    await user.save();
    return responseHandler.ok(res, user);
  } catch (error) {
    console.error("Error adding follow:", error);
    return responseHandler.error(res);
  }
};

const deleteFollow = async (req, res) => {
  const { id } = req.body;
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return responseHandler.notfound(res);
    }
    user.following = user.following.filter(followId => followId !== id);
    await user.save();
    return responseHandler.ok(res, user);
  } catch (error) {
    console.error("Error deleting follow:", error);
    return responseHandler.error(res);
  }
};

export default {
  createUser,
  getListUser,
  getUserById,
  updateUser,
  getUserFeed,
  createPost,
  addFollow,
  deleteFollow
};
