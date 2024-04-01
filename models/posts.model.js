import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    user: {
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
