import Post from '../models/posts.model.js';

const createPost = async (req, res) => {
    const { userId, text } = req.body;
    console.log(userId)
    try {
        const newPost = new Post({
            userId,
            time: new Date(),
            text
        });
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostsByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const posts = await Post.find({ userId });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: 'No posts found for this user' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error getting posts by user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {
    createPost,
    getPostsByUser
}