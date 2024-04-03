import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
