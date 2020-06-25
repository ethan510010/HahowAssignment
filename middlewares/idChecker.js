const isNormalInteger = (str) => /^\+?([1-9]\d*)$/.test(str);

const checkIdValidity = (req, res, next) => {
  if (!isNormalInteger(req.params.id)) {
    return res.status(400).json({
      message: 'the hero id should be a positive interger',
    });
  }
  return next();
};

module.exports = checkIdValidity;
