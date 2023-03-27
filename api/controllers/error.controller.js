exports.handleInvalidPaths = (req, res, next) => {
    const err = { msg: "404: Not found", status: 404 };
    next(err);
  };
  