const logger = require('../helpers/logger');

function infoHandler(info,req){
    logger.info(info.status + " \"" + info.message + "\" at  \"" + req.originalUrl + "\"" );
}

module.exports = {
    infoHandler
}