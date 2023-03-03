const logger = require('../log/logger');

function errorhandler(err, req, res, next) {
    let message = ""
    let errorCode = err || 500;
    switch (errorCode) {
        case 400:
            message = "Bad request";
            break;
        case 401:
            message = "Unauthorized";
            break;
        case 403:
            message = "Forbidden";
            break;
        case 404:
            message = "Not found";
            break;
        case 405:
            message = "Method not allowed";
            break;
        case 500:
            message = "Internal server error";
            break;
        default:
            message = "Internal server error";
            break;
    }
    logger.error(errorCode + " " + message + " at " + req.originalUrl );
    res.status(errorCode).json({
        type: "error",
        error: errorCode,
        message: message
    });
}

module.exports ={
    errorhandler
}