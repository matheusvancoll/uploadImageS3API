const dadosConfig = require("../config/config.json")

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");


const storageTypes = {
    s3: multerS3({
        s3: new aws.S3({
            accessKeyId: dadosConfig.S3.acessKeyId,
            secretAccessKey: dadosConfig.S3.secretAccessKey
        }),
        bucket: dadosConfig.S3.bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                const fileName = `${hash.toString("hex")}`;
                cb(null, fileName);
            });
        }
    })
};

module.exports = {
    dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
    storage: storageTypes["s3"],
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."));
        }
    }
};
