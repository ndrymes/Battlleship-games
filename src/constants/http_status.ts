class HTTPStatus {}

Object.defineProperty(HTTPStatus, 'OK', {
  value: 200,
  writable: false,
  enumerable: true,
  configurable: false,
});

Object.defineProperty(HTTPStatus, 'NO_CONTENT', {
  value: 204,
  writable: false,
  enumerable: true,
  configurable: false,
});

Object.defineProperty(HTTPStatus, 'BadRequest', {
  value: 400,
  writable: false,
  enumerable: true,
  configurable: false,
});

Object.defineProperty(HTTPStatus, 'INTERNAL_SERVER_ERROR', {
  value: 500,
  writable: false,
  enumerable: true,
  configurable: false,
});

module.exports = HTTPStatus;
