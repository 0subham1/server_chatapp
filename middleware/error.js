



const errorHandler = (res, code, message) => {
  return res.status(code).send({
    success: false,
    message,
  });
};

module.exports = errorHandler;
