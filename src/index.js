const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())

const bucketName = 'schoolbutterfliestest.appspot.com';

// The path to which the file should be downloaded
const destFileName = './bf.png';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({projectId: "schoolbutterfliestest"});

async function downloadFile() {
    const fileName = 'textures/bf.png';
    const options = {
	destination: destFileName,
    };

    // Downloads the file
    await storage.bucket(bucketName).file(fileName).download(options);

    console.log(
	`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
    );
}

async function downloadIntoMemory(res) {
    const fileName = 'textures/bf.png';
    storage.bucket(bucketName)
	.file(fileName)
	.download()
	.then(data => {
	    const contents = data[0]
	    res.writeHead(200, {
		'Content-Type': "image/png",
		'Content-disposition': 'attachment;filename=' + fileName,
		'Content-Length': contents.length
	    });
	    res.end(Buffer.from(contents, 'binary'));

	})
	.catch(e => res.status(500).send("Something Went Wrong"));
}

async function SendTexture(tex, res) {
    const fileName = "textures/" + tex;
    storage.bucket(bucketName)
	.file(fileName)
	.download()
	.then(data => {
	    const contents = data[0]
	    res.writeHead(200, {
		'Content-Type': "image/png",
		'Content-disposition': 'attachment;filename=' + fileName,
		'Content-Length': contents.length
	    });
	    res.end(Buffer.from(contents, 'binary'));

	})
	.catch(e => res.status(500).send("Something Went Wrong"));
}

app.get('/:tex', (req, res) => {
     SendTexture(req.params['tex'], res);
})

app.get('/default', (req, res) => {
    console.log("Request");
    downloadIntoMemory(res);
})

app.get('/', (req, res) => {
	res.send("SBIServer");
})


app.listen(3000);
