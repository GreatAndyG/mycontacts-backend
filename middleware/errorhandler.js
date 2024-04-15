const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  if (err.type == "entity.parse.failed") {
    return res.status(400).json({ error: "Input must be valid json" });
  }

  console.log(err);

  return res.status(500).json({ error: "Internal Server Error" });
};

module.exports = errorHandler;
