const jwt = require("jsonwebtoken");

module.exports.verifyTokenAccess = (req, res, next) => {
  console.log("token", req.token);
  const token = req.token;
  const key = "saitama";
  jwt.verify(token, key, (err, decoded) => {
    if (err) return res.status(401).send({ message: "user unauthorized" });
    console.log(decoded);
    req.user = decoded;
    next();
  });
};

module.exports.verifyEmailToken = (req, res, next) => {
  console.log("token", req.token);
  const token = req.token;
  const key = "king";
  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "user unauthorized" });
    }
    console.log(decoded);
    req.user = decoded;
    next();
  });
};

module.exports.verifyEmailforget = (req, res, next) => {
  console.log("token", req.token);
  const token = req.token;
  const key = "mumen";
  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "user unauthorized" });
    }
    console.log(decoded);
    req.user = decoded;
    next();
  });
};

module.exports.checkid = (req, res, next) => {
  const { idusers } = req.body;
  if (idusers === req.user.idusers) {
    next();
  } else {
    return res.status(401).send({ message: "user unauthorized" });
  }
};