import express from 'express'
const PORT = process.env.PORT || 5000

express()
  .get('/', (_req, res) => res.json({method: "こんにちは、getさん"}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))