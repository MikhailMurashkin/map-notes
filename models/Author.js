import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    subscribersId: [{
        type: String
    }],
    description: {
        type: String
    }
}, { timestamps: true })

authorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

authorSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const Author = mongoose.model('Author', authorSchema)

export default Author