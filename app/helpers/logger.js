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

function deleteLine(){
  // si le fichier log contient plus de 1000 lignes, on supprime les 500 premières lignes
  if (fs.readFileSync("log/app.log").toString().split("\r \n").length > 1000) {
    let lines = fs.readFileSync("log/app.log").toString().split("\r \n");
    lines.splice(0, 990);
    fs.writeFileSync("log/app.log", lines.join("\r \n"));
  }
}

function error(message) {
    createFile();
    fs.appendFileSync("log/app.log", "ERROR: " + message + " " + new Date() + " \r \n");
    deleteLine();
}

function info(message) {
    createFile();
    fs.appendFileSync("log/app.log", "INFO: " + message + " " + new Date() + " \r \n");
    deleteLine();
}

module.exports = {
    error,
    info
}
