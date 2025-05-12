import express from 'express'
import { createServer } from 'node:http'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import storyRoutes from './routes/storyRoutes.js'
// import chatRoutes from './routes/chatRoutes.js'
import jwt from 'jsonwebtoken'


// import Chat from './models/Chat.js'
// import Message from './models/Message.js'
// import Group from './models/Group.js'

import dotenv from 'dotenv'
dotenv.config()


const app = express()
const server = createServer(app)

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

mongoose.connect(process.env.MONGO_URI, {
    family: 4
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))


app.use('/auth', authRoutes)
app.use('/stories', storyRoutes)
// app.use('/chat', chatRoutes)


const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});