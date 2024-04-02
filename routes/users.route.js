import express from 'express';
import usersController from "../controller/user.controller.js"

const router = express.Router();

// Adjusted routes to match the API calls in the User class
router.post('/:userId', usersController.createUser);
router.get('/', usersController.getListUser);
router.get('/:userId', usersController.getUserById);
router.patch('/:userId', usersController.updateUser);
router.get('/:userId/feed', usersController.getUserFeed);
router.post('/:userId/posts', usersController.createPost);
router.post('/:userId/follow', usersController.addFollow);
router.delete('/:userId/follow', usersController.deleteFollow);


export default router;