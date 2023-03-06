function createDetails(status, err) {
  let lines = err.stack.split("\n");
  let stack = [];
  lines.forEach((line) => {
    stack.push(line.trim());
  });
  let file = stack[1].split(" ");
  let fileLine = file[1].split(":");
  let json = {
    type: "error",
    status: status,
    message: err.message,
    stack: {
      file: fileLine[0],
      line: fileLine[1],
    },
  };
  return json;
}


function createDetailsPerso(status, err) {
    return{
        type: "error",
        status: status,
        message: err.message,
        stack: {
            file: err.file,
            line: err.line,
        },
    }
}

module.exports = {
    createDetails,
    createDetailsPerso
};
