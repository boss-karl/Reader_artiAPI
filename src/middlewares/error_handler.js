const multer = require("multer");

const errorHandler = (err, req, res, next) =>{
    console.error(err.stack || "");
    console.error(err.message);
    const status = err.status || 500;

    if(err instanceof multer.MulterError){
        res.status(400).json('Invalid file type or too large file');
    }
    res.status(status).json({error: err.message});
};

module.exports = errorHandler;