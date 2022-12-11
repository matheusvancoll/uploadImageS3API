const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const aws = require("aws-sdk");
const dadosConfig = require("./config/config.json");
const s3 = new aws.S3({
    accessKeyId: dadosConfig.S3.acessKeyId,
    secretAccessKey: dadosConfig.S3.secretAccessKey
})


routes.get('/image/status', (req, res) => {
    return res.json("API Running")
})

routes.post("/image/uploadImage", multer(multerConfig).single("file"), (req, res) => {
    const {originalname: name, size, key, location: url = ""} = req.file;

    return res.json(req.file);
});


routes.delete("/image/deleteImage/:key", async (req, res) => {
    let keyImagem = req.params.key
    let params = {
        Bucket: dadosConfig.S3.bucketName,
        Key: keyImagem
    };

    s3.deleteObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            return res.json("Fail")
        }
        else{
            res.json("Sucess")
        }
    })
});

module.exports = routes;
