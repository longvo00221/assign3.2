import express from 'express';
import usersRoute from './users.route.js';
import postsRoute from './posts.route.js';
const router = express.Router()

router.use('/users',usersRoute)
router.use('/posts',postsRoute)


export default router;