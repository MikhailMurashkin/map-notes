import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
    storyId: {
        type: String,
        unique: true
    },
    authorId: {
        type: String,
        required: true
    },
    storyName: {
        type: String
    },
    storyText: {
        type: String
    },
    storyImages: [{
        type: String
    }],
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
    }
}, { timestamps: true })

const Story = mongoose.model('Story', storySchema)

export default Story