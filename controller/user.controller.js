// users.controller.js

import userService from "../services/users.service.js";
import responseHandler from "../handlers/response.handler.js";

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return responseHandler.created(res, user);
  } catch (error) {
    console.error("Error creating user:", error);
    return responseHandler.error(res);
  }
};

const getListUser = async (req, res) => {
  try {
    const users = await userService.getListUser();
    return responseHandler.ok(res, users);
  } catch (error) {
    console.error("Error getting user list:", error);
    return responseHandler.error(res);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    return responseHandler.ok(res, user);
  } catch (error) {
    console.error("Error getting user details:", error);
    return responseHandler.error(res);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.userId, req.body);
    return responseHandler.ok(res, user);
  } catch (error) {
    console.error("Error updating user:", error);
    return responseHandler.error(res);
  }
};

const getUserFeed = async (req, res) => {
  try {
    const posts = await userService.getUserFeed(req.params.userId);
    return responseHandler.ok(res, posts);
  } catch (error) {
    console.error("Error getting user feed:", error);
    return responseHandler.error(res);
  }
};

const createPost = async (req, res) => {
  try {
    const post = await userService.createPost(req.params.userId, req.body);
    return responseHandler.created(res, post);
  } catch (error) {
    console.error("Error creating post:", error);
    return responseHandler.error(res);
  }
};

const addFollow = async (req, res) => {
  try {
    const user = await userService.addFollow(req.params.userId, req.body);
    return responseHandler.ok(res, user);
  } catch (error) {
    console.error("Error adding follow:", error);
    return responseHandler.error(res);
  }
};

const deleteFollow = async (req, res) => {
  try {
    const user = await userService.deleteFollow(req.params.userId, req.body);
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