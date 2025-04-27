import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    storyId: {
        type: String
    },
    authorId: {
        type: String,
        required: true
    },
    commentText: {
        type: String
    },
    createdAt: {
        type: Date,
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

export default Comment