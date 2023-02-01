const fs = require("fs");

function createFile() {
  // crée le dossier log s'il n'existe pas
  if (!fs.existsSync("log")) {
    fs.mkdirSync("log");
  }
  // crée le fichier log s'il n'existe pas
  if (!fs.existsSync("log/log.log")) {
    fs.writeFileSync("log/log.log", "");
  }
}

function error(message) {
    createFile();
    fs.appendFileSync("log/log.log", "ERROR: " + message + " " + new Date() + " \r \n");
}

function info(message) {
    createFile();
    fs.appendFileSync("log/log.log", "INFO: " + message + " " + new Date() + " \r \n");
}

module.exports = {
    error,
    info
}
