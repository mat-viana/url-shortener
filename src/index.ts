import express, { type Request, type Response } from 'express'
import shortid from 'shortid'

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.get('/', function(req: Request, res: Response) {
  res.json({
    id: 444,
    url: 'http://google.com'
  });
});

app.post('/', function(req: Request, res: Response) {
  const originalUrl = req.query.url;


  res.json({
    id: 1,
    originalUrl: originalUrl,
    shortUrl: shortid.generate()
  })
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`)
})