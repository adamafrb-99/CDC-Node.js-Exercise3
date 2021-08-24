const logRequest = (req, res, next) => {
  let date = new Date(Date.now()).toLocaleString().split(",");

  console.log(
    `> At: ${date[0]} ${date[1]} \n  URL: ${req.baseUrl}${req.path} \n  Method: ${req.method}`
  );

  next();
};

module.exports = logRequest;
