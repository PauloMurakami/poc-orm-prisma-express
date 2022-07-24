import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  })
  res.json(posts)
})

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body
  const post = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  })
  res.json(post)
})

app.put('/publish/:id', async (req, res) => {
  let { id } = req.params
  let idI = parseInt(id)
  const post = await prisma.post.update({
    where: { id: idI },
    data: { published: true },
  })
  res.json(post)
})

app.delete('/user/:id', async (req, res) => {
  const { id } = req.params
  let idI = parseInt(id)
  const user = await prisma.user.delete({
    where: {
      id: idI,
    },
  })
  res.json(user)
})

app.listen(3000)