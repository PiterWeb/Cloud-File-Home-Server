var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var fs = require('fs');
var ip = require("ip");

var root = __dirname + '/files/';

const app = express();
const port = 5000;

var server = 'http://' + ip.address() + ':' + port;

app.use((req, res, next) => {
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(fileUpload());

app.use(express.static(root));

app.listen(port, () => {

    console.log(`Example app listening at http://localhost:${port}`);

});

app.get('/', (req, res) => {

    res.status(200).send("Working")

});

app.get('/api/files', (req, res) => {

    fs.readdir(root , (err, files) => {

        if (err) {
            return console.log(err);
        }

        var folderFiles = [];

        files.forEach(file => {
            
            folderFiles.push(file);
    
        });

        res.json(folderFiles);

    });

});

app.get('/api/file/:fileName', (req, res) => {

    var fileName = req.params.fileName;

    var fileRoute = server + '/' + fileName;

    var file = {

        fileName

    }

    if(fileName.includes('.txt')) {

        fs.readFile(root + fileName , (err, fileData) => {

            if (err) return console.log(err);
    
            let base64ToString = Buffer.from(fileData, "base64").toString();
    
            file['content'] = base64ToString;
        
            res.json(file);
    
        });

    }else if(fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png')){

        file['imgsrc'] = fileRoute;

        res.json(file);

    }else if(fileName.includes('.mp3')){

        file['audiosrc'] = fileRoute;

        res.json(file);

    }else if(fileName.includes('.mp4')){

        file['videosrc'] = fileRoute;

        res.json(file);

    }else {

        res.json(file);

    }

});

app.get('/api/file/:fileName/download' , (req, res) => {

    res.download(root + req.params.fileName);

});

app.post('/api/files/:fileName/upload' , (req, res) => {

    var filePath = root + req.params.fileName;

    console.log(req.params.fileName);

    var file = req.files['myFile'];

    console.log(file);

    file.mv(filePath , (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Success');
            res.json({status : 200});
        }

    });

});
