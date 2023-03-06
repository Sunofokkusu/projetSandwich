const fs = require("fs");

function createFile() {
  // crée le dossier log s'il n'existe pas
  if (!fs.existsSync("log")) {
    fs.mkdirSync("log");
  }
  // crée le fichier log s'il n'existe pas
  if (!fs.existsSync("log/app.log")) {
    fs.writeFileSync("log/app.log", "");
  }
}

function error(message) {
    createFile();
    fs.appendFileSync("log/app.log", "ERROR: " + message + " " + new Date() + " \r \n");
}

function info(message) {
    createFile();
    fs.appendFileSync("log/app.log", "INFO: " + message + " " + new Date() + " \r \n");
}

module.exports = {
    error,
    info
}
