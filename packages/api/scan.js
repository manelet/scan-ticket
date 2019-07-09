const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { spawn } = require('child_process')
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')

const ep = new exiftool.ExiftoolProcess(exiftoolBin)

async function saveExif (file, exif) {
  return ep
    .open()
    .then(() =>
      ep.writeMetadata(file, {
        all: '', // remove existing tags
        ...exif
      }, ['overwrite_original'])
    )
    .finally(() => ep.close())
}

async function scan (input, exif) {
  if (!input) {
    throw new Error('Input must be provided')
  }

  try {
    const ts = Date.now()
    const filename = `${ts}.jpg`
    let file = `../../data/images/${filename}`
    await save(input, file)

    if (exif) {
      await saveExif(file, exif)
    }

    const text = await analyze(file)
    const data = {
      image: filename,
      text,
      price: null
    }

    fs.writeFileSync('../../data/' + ts + '.json', JSON.stringify(data), 'utf-8')

    clean(file)

    return text
  } catch (err) {
    throw err
  }
}

function clean (file) {
  // fs.unlinkSync(file)
  // fs.unlinkSync('./output.png')
}

async function save (input, file) {
  try {
    if (typeof input === 'string') {
      if (isUrl(input)) {
        await fetch(file, input)
      } else if (isFile(path.join(__dirname, input))) {
        fs.copyFileSync(path.join(__dirname, input), file)
      } else {
        throw new Error('Can\t find file or url related to input string')
      }
    } else if (Buffer.isBuffer(input)) {
      await saveBuffer(input, file)
    }
  } catch (err) {
    throw err
  }
}

function isFile (input) {
  try {
    return fs.statSync(input).isFile()
  } catch (err) {
    return false
  }
}

function fetch (file, url) {
  return new Promise (function (resolve, reject) {
    try {
      const s = fs.createWriteStream(file)
      const r = axios.get({
        url: input,
        method: 'GET',
        responseType: 'stream'
      })

      r.data.pipe(s)
      s.on('finish', resolve)
      s.on('error', reject)
    } catch (err) {
      return reject(err)
    }
  })
}

function isUrl(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

function saveBuffer (buffer, filename) {
  return new Promise ((resolve, reject) => {
    const stream = fs.createWriteStream(filename)
    stream.write(buffer)
    stream.end()
    stream.on('close',resolve)
    stream.on('error', reject)
  })
}

function analyze (path) {
  return new Promise((resolve, reject) => {
    // const cmd = spawn('open', ['./tmp.jpg'])
    const cmd = spawn('./scan.sh', [path])
    cmd.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
      resolve(data.toString())
    });

    cmd.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
      // reject(data)
    });

    cmd.on('close', code => {
      console.log(`child process exited with code ${code}`);
      // resolve()
    });    
  })
}

module.exports = scan