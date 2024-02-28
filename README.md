# Short url app

This is a node + typescript project that creates a simple url shortner.

## Setup

1. Install dependencies with `npm install`.
2. Transpile typescript code to js `npm run build`.
3. Run the project `npm run start`.

## Testing

You have three available APIs

### Create a short url

Send a post request to `http://localhost:3000/short` with your url as a parameter example: `http://localhost:3000/short?url=https://www.google.com/`

With this you will receive a json response with your shorted url

### Use short url

Just use the URL and you will be redirecrted example:`http://localhost:3000/r/eoetkSnnv`

### Url rank

To check the most accessed urls send a get request to `http://localhost:3000/rank`

