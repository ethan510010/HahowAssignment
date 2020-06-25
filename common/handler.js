const handler = (promise) => promise
  .then((data) => ([data, undefined]))
  .catch((error) => ([undefined, error]));

module.exports = handler;
