/*
Copyright 2017 Bob Lee <emailbob@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const args = require('yargs')
  .help()
  .default('port', 9000)
  .usage('Usage: $0 -h [tensorflow servering host] -i [image path]')
  .example('$0 -h [host] -i [image] -v -d', 'Running with verbose and then deleting the image if it was downloaded from a url')
  .alias('i', 'image')
  .alias('p', 'port')
  .alias('h', 'host')
  .alias('v', 'verbose')
  .alias('d', 'delete')
  .demandOption(['image','host'])
  .argv
const download = require('image-downloader')
const url = require('url')
const fs = require('fs')

if (args.v) {
  console.log('Image: ' + args.image)
  console.log('Host: ' + args.host)
  console.log('Port: ' + args.port)
}

const image = url.parse(args.image)

const options = {
  url: args.image,
  dest: './'
}

async function downloadIMG () {
  try {
    const { filename } = await download.image(options)

    if (args.v) {
      console.log('Downloading image: ' + filename)
    }

    return filename
  } catch (e) {
    throw e
  }
}

// If the image is a url download it
if (image.protocol != null) {
  downloadIMG().then((result) => {
    sendToTensorflow(result)

    // Clean up downloaded images
    if (args.delete) {
      fs.unlink(result, (err) => {
        if (err) throw err
        if (args.v) console.log('successfully deleted: ' + result)
      })
    }
  })
} else {
  if (args.v) console.log('Using local image')
  sendToTensorflow(args.image)
}

// Send image to TensforFlow serving host
function sendToTensorflow (imagePath) {
  const client = require('tensorflow-serving-node-client')(args.host + ':' + args.port)
  const buffer = fs.readFileSync(imagePath)

  client.predict(buffer, (err, res) => {
    if (err) {
      return console.error(err)
    }

    console.log(res)
  })
}
