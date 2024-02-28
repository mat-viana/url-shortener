import express from 'express'
import dotenv from 'dotenv'

import { setupDatabase } from './database/database'
import { createShortUrl, getUrlRank, urlResolver } from './services/shortener'

dotenv.config()
bootstrap()

const port = process.env.PORT ?? 3000

async function bootstrap () {
  await setupDatabase()

  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.post('/short', createShortUrl)
  app.get('/rank', getUrlRank)
  app.get('/r/:url', urlResolver)

  app.listen(port, () => {
    console.log('Server running on http://localhost:3000')
  })
}
