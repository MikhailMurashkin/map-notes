import express from 'express'
import multer from 'multer'
import fs from 'fs'

import Author from '../models/Author.js'
import Story from '../models/Story.js'
import Comment from '../models/Comment.js'
import protect from '../middleware/authMiddleware.js'

const storyRoutes = express.Router()

storyRoutes.post('/createStory', protect, multer({ dest: 'uploads/' }).array('images', 12),
  async (req, res) => {
    try {
        let imagesLinks = []
        req.files.forEach(image => {
          let imageLink = 'storyimages/' + generateId() + '.' + image.originalname.split('.')[1]
          imagesLinks.push(imageLink)

          let tmp_path = image.path
          let target_path = 'client/public/' + imageLink
          let src = fs.createReadStream(tmp_path)
          let dest = fs.createWriteStream(target_path)
          src.pipe(dest)
        })

        const { storyName, storyText, longitude, latitude } = req.body

        const story = await Story.create({
            storyName,
            storyText,
            storyImages: imagesLinks,
            storyId: generateId(),
            authorId: req.author,
            longitude,
            latitude,
            createdAt: Date.now()
        })

        res.status(201).json({ storyId: story.storyId })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
})

storyRoutes.post('/deleteStory', protect, async (req, res) => {
    try {
        const { storyId } = req.body
        let story = await Story.findOne({ storyId })

        if (story.authorId != req.author) {
          res.status(401).json({ message: 'Not allowed' })
        }

        await Story.deleteOne({ storyId })

        res.status(201).json({ message: 'Story deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
})

storyRoutes.get('/getStories', protect, async (req, res) => {
  try {
      let stories = await Story.find({ })
      let authors = await Author.find({ })
      let comments = await Comment.find({ })
      
      let storiesExtended = []
      stories.forEach(story => {
          story = story._doc

          let authorI = authors.findIndex(a => a.id == story.authorId)
          story.authorName = authors[authorI].name

          story.authoredByMe = story.authorId == req.author

          let storyAuthorSubscribers = authors[
            authors.findIndex(a => a.id == story.authorId)
          ].subscribersId
          story.subscribedByMe = storyAuthorSubscribers.indexOf(req.author) == -1 ? false : true

          story.likedByMe = story.likedAuthorsId.indexOf(req.author) == -1 ? false : true
          story.dislikedByMe = story.dislikedAuthorsId.indexOf(req.author) == -1 ? false : true

          story.ammountOfLikes = story.likedAuthorsId.length
          story.ammountOfDislikes = story.dislikedAuthorsId.length
          delete story.likedAuthorsId
          delete story.dislikedAuthorsId

          let storyComments = []

          comments.forEach(comment => {
            if (comment.storyId == story.storyId) {
              comment = comment._doc
              let commentAuthorI = authors.findIndex(a => a.id == comment.authorId)
              comment.authorName = authors[commentAuthorI].name
              storyComments.push(comment)
            }
          })

          story.comments = storyComments.reverse()

          storiesExtended.push(story)
      })

      res.json(storiesExtended)
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' });
  }
})

storyRoutes.post('/getStoriesByAuthorId', protect, async (req, res) => {
    try {
        const { authorId } = req.body
        let authorStories = await Story.find({ authorId: authorId || req.author})
        let author = await Author.findById( authorId || req.author )
        let comments = await Comment.find({ })
        let authors = await Author.find({ })

        let authorStoriesExtended = []
        authorStories.forEach(authorStory => {
          authorStory = authorStory._doc

          authorStory.authorName = author.name

          authorStory.authoredByMe = authorStory.authorId == req.author

          authorStory.likedByMe = authorStory.likedAuthorsId.indexOf(req.author) == -1 ? false : true
          authorStory.dislikedByMe = authorStory.dislikedAuthorsId.indexOf(req.author) == -1 ? false : true

            
          authorStory.ammountOfLikes = authorStory.likedAuthorsId.length
          authorStory.ammountOfDislikes = authorStory.dislikedAuthorsId.length
          delete authorStory.likedAuthorsId
          delete authorStory.dislikedAuthorsId

          
          let storyAuthorSubscribers = authors[authors.findIndex(a => a.id == authorStory.authorId)].subscribersId
          authorStory.subscribedByMe = storyAuthorSubscribers.indexOf(req.author) == -1 ? false : true

          let authorStoryComments = []

          comments.forEach(comment => {
            if (comment.storyId == authorStory.storyId) {
              comment = comment._doc
              let commentAuthorI = authors.findIndex(a => a.id == comment.authorId)
              comment.authorName = authors[commentAuthorI].name
              authorStoryComments.push(comment)
            }
          })
          

          authorStory.comments = authorStoryComments.reverse()

          authorStoriesExtended.push(authorStory)
        })
        
        let authorSubscribers = author.subscribersId
        let subscribedByMe = authorSubscribers.indexOf(req.author) == -1 ? false : true

        res.json({
          authorName: author.name,
          authorId: author._id,
          authorDescription: author.description,
          subscribedByMe,
          subscribersAmmount: author.subscribersId.length,
          description: author.description,
          authorImage: author.image,
          stories: authorStoriesExtended,
          image: author.image
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
})

storyRoutes.get('/getSubscribedAuthorsStories', protect, async (req, res) => {
  try {
      let subscriptions = await Author.find({ subscribersId: req.author })
      let subsriptionsIds = []
      subscriptions.forEach(sub => {
        subsriptionsIds.push(sub._id)
      })
      let authorsStories = await Story.find({ authorId: { $in: subsriptionsIds } })
      let comments = await Comment.find({ })
      let authors = await Author.find({ })

      let authorsStoriesExtended = []
      authorsStories.forEach(authorStory => {
          authorStory = authorStory._doc

          let author = subscriptions[subscriptions.findIndex(s => s.id == authorStory.authorId)]
          authorStory.authorName = author.name

          authorStory.authoredByMe = authorStory.authorId == req.author

          authorStory.likedByMe = authorStory.likedAuthorsId.indexOf(req.author) == -1 ? false : true
          authorStory.dislikedByMe = authorStory.dislikedAuthorsId.indexOf(req.author) == -1 ? false : true

            
          authorStory.ammountOfLikes = authorStory.likedAuthorsId.length
          authorStory.ammountOfDislikes = authorStory.dislikedAuthorsId.length
          delete authorStory.likedAuthorsId
          delete authorStory.dislikedAuthorsId

          let storyComments = []

          comments.forEach(comment => {
            if (comment.storyId == authorStory.storyId) {
              comment = comment._doc
              let commentAuthorI = authors.findIndex(a => a.id == comment.authorId)
              comment.authorName = authors[commentAuthorI].name
              storyComments.push(comment)
            }
          })

          authorStory.comments = storyComments.reverse()

          
          let storyAuthorSubscribers = authors[authors.findIndex(a => a.id == authorStory.authorId)].subscribersId
          authorStory.subscribedByMe = storyAuthorSubscribers.indexOf(req.author) == -1 ? false : true

          authorsStoriesExtended.push(authorStory)
      })

      res.json({
        stories: authorsStoriesExtended
      })
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' })
  }
})

storyRoutes.post('/likeStory', protect, async (req, res) => {
  try {
      const { storyId } = req.body
      let story = await Story.findOne({ storyId })

      if (story.likedAuthorsId.indexOf(req.author) >= 0) {
        await Story.findOneAndUpdate({ storyId }, {
          $pull: {likedAuthorsId: req.author}
        })
      } else {
        await Story.findOneAndUpdate({ storyId }, {
          $push: {likedAuthorsId: req.author},
          $pull: {dislikedAuthorsId: req.author}
        })
      }

      res.status(200).json({ message: 'Like updated' });
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' });
  }
})

storyRoutes.post('/dislikeStory', protect, async (req, res) => {
  try {
      const { storyId } = req.body
      let story = await Story.findOne({ storyId })

      if (story.dislikedAuthorsId.indexOf(req.author) >= 0) {
        await Story.findOneAndUpdate({ storyId }, {
          $pull: {dislikedAuthorsId: req.author}
        })
      } else {
        await Story.findOneAndUpdate({ storyId }, {
          $push: {dislikedAuthorsId: req.author},
          $pull: {likedAuthorsId: req.author}
        })
      }

      res.status(200).json({ message: 'Dislike updated' });
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' });
  }
})

storyRoutes.post('/subscribeAuthor', protect, async (req, res) => {
  try {
      const { authorId } = req.body
      let author = await Author.findById(authorId)

      if (author.subscribersId.indexOf(req.author) < 0) {
        await Author.findByIdAndUpdate(authorId, {
          $push: {subscribersId: req.author}
        })
      } else {
        await Author.findByIdAndUpdate(authorId, {
          $pull: {subscribersId: req.author}
        })
      }

      res.status(200).json({ message: 'Subscription updated' });
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' });
  }
})

storyRoutes.post('/comment', protect, async (req, res) => {
  try {
      const { storyId, commentText } = req.body
      let story = await Story.findOne({ storyId })
      if(!story) {
        res.status(404).json({ message: 'Wrong story id' });
      }

      const comment = await Comment.create({
          storyId,
          authorId: req.author,
          commentText,
          createdAt: Date.now()
      })

      res.status(201).json({ message: 'Comment added' })
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' })
  }
})

storyRoutes.get('/getMyProfileInfo', protect, async (req, res) => {
  try {
    let author = await Author.findById(req.author)

    let stories = await Story.find({ authorId: req.author })
    let storiesIds = []
    stories.forEach(story => {
      storiesIds.push(story.storyId)
    })

    let subscriptions = await Author.find({ subscribersId: req.author })
    let subsriptionsIds = []
    subscriptions.forEach(sub => {
      subsriptionsIds.push(sub._id)
    })
    
    res.json({
      name: author.name,
      image: author.image,
      description: author.description,
      subscriptions: subsriptionsIds,
      subscribers: author.subscribersId,
      stories: storiesIds
    })
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' })
  }
})
  
storyRoutes.post('/updateProfileDescription', protect, async (req, res) => {
  try {
      const { description } = req.body
      let author = await Author.findByIdAndUpdate( req.author, {
        description
      })

      res.status(201).json({ message: 'Profile description updated' })
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' })
  }
})


const generateId = () => {
    const characters = 'qwertyuiopasdfghjklzxcvbnm0123456789';
    let code = '';
    for (let i = 0; i < 33; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}


export default storyRoutes