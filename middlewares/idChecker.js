const checkIdValidity = (req, res, next) => {
  if (!isPositiveInteger(req.params.id)) {
    return res.status(400).json({
      message: 'the hero id should be interger'
    })
  }
  next();
};

const isPositiveInteger = (x) => {
  return Number.isInteger(x) && x > 0
}

module.exports = checkIdValidity;