import express from 'express'
import jwt from 'jsonwebtoken'

import Author from '../models/Author.js'
import protect from '../middleware/authMiddleware.js'
const authRoutes = express.Router()

authRoutes.post('/register', async (req, res) => {
    try {
        console.log("register")
        const { name, email, password } = req.body;

        const authorExists = await Author.findOne({ email });
        if (authorExists) {
            return res.status(400).json({ message: 'Author already exists' });
        }

        const author = await Author.create({ name, email, password });

        const token = jwt.sign({ id: author._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.status(201).json({ token, authorId: author._id, name: author.name });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
});

authRoutes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const author = await Author.findOne({ email });

        if (!author || !(await author.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: author._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.json({ token, authorId: author._id, name: author.name });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

authRoutes.get('/me', protect, async (req, res) => {
    try {
      const author = await Author.findById(req.author).select('-password');
      if (!author) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.status(200).json(author);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default authRoutes;