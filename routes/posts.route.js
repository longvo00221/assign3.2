import express from 'express';
import postsController from "../controller/post.controller.js";

const router = express.Router();
router.get('/:user', postsController.getPostsByUser);

export default router;
