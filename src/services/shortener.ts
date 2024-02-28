import { type Request, type Response } from 'express'
import shortid from 'shortid'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase } from '../database/database'

const port = process.env.PORT ?? 3000
const baseUrl = process.env.BASE_URL ?? 'localhost'

interface ShortUrl {
  id: string
  originalUrl: string
  shortUrl: string
  shortUrlKey: string
  totalAccess: number
}

export async function createShortUrl (req: Request, res: Response) {
  const originalUrl = String(req.query.url)

  const existingUrl = await fetchUrlByUrl(originalUrl)

  if (existingUrl) {
    return res.status(422).json({
      message: 'Url already exists',
      url: existingUrl
    })
  }

  const shortUrlKey = shortid.generate()

  const newUrl: ShortUrl = {
    id: uuidv4(),
    originalUrl,
    shortUrl: `http://${baseUrl}:${port}/r/${shortUrlKey}`,
    shortUrlKey,
    totalAccess: 0
  }

  await addUrl(newUrl)

  return res.json(newUrl)
}

export async function urlResolver (req: Request, res: Response) {
  const shortUrl = String(req.params.url)

  console.log('URL: ', shortUrl)

  const url = await fetchUrlByShortUrl(shortUrl)

  if (!url) {
    return res.status(400).json({
      message: 'Url not found'
    })
  }

  res.redirect(url.originalUrl)
  await updateTotalAccess(url.id)
}

export async function getUrlRank (req: Request, res: Response) {
  const urls = await fetchUrlRank()

  return res.json(urls)
}

async function fetchUrlByUrl (url: string): Promise<ShortUrl | undefined> {
  const dbUrlQuery = await getDatabase().prepare(`SELECT id, original_url, short_url, total_access FROM urls WHERE original_url = '${url}'`)
  const urlDB = await dbUrlQuery.get()

  if (!urlDB) return

  return {
    id: urlDB.id,
    originalUrl: urlDB.original_url,
    shortUrl: urlDB.short_url,
    shortUrlKey: urlDB.short_url_key,
    totalAccess: urlDB.total_access
  }
}

async function fetchUrlByShortUrl (url: string): Promise<ShortUrl | undefined> {
  const dbUrlQuery = await getDatabase().prepare(`SELECT id, original_url, short_url, total_access FROM urls WHERE short_url_key = '${url}'`)
  const urlDB = await dbUrlQuery.get()

  if (!urlDB) return

  return {
    id: urlDB.id,
    originalUrl: urlDB.original_url,
    shortUrl: urlDB.short_url,
    shortUrlKey: urlDB.short_url_key,
    totalAccess: urlDB.total_access
  }
}

async function fetchUrlRank (): Promise<ShortUrl[]> {
  const dbUrlQuery = await getDatabase().prepare('SELECT id, original_url, short_url, total_access FROM urls order by total_access desc')
  return await dbUrlQuery.all()
}

async function updateTotalAccess (urlId: string): Promise<void> {
  try {
    await getDatabase().run(`
      UPDATE urls 
      SET total_access = total_access + 1 
      WHERE id = '${urlId}';
    `)

    console.log(`Total access updated for URL with ID ${urlId}.`)
  } catch (error) {
    console.error('Error updating total access:', error)
    throw error
  }
}

async function addUrl (url: ShortUrl) {
  try {
    await getDatabase().exec(`INSERT INTO urls VALUES ('${url.id}', '${url.originalUrl}', '${url.shortUrl}', '${url.shortUrlKey}', 0)`)

    console.log(`New url with added with ID ${url.id}.`)
  } catch (error) {
    console.error('Error inserting url:', error)
    throw error
  }
}
