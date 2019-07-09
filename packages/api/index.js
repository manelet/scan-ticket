const app = require('express')()
const multer = require('multer')
const fs = require('fs')
const scan = require('./scan')
const Storage = multer.memoryStorage()
const upload = multer({ storage: Storage })
const port = 3010

app.use(require('body-parser').json())

app.get('/upload', async (req, res, next) => {
  const text = await scan(req.query.url || req.query.path)
  res.json({ text })
})

app.post('/upload', upload.array('photo', 3), async (req, res, next) => {
  const { body, files } = req
  const exif = body.exif ? JSON.parse(body.exif) : undefined
  // console.log('bodyyy', body, files)
  const text = await scan(files[0].buffer, exif)
  res.json({ text })
})

app.listen(port, () => console.log(`API Listening on port ${port}`))