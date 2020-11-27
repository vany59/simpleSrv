const OK = (data = null) => ({
  code: 200,
  data,
  message: "success",
});

const UNAUTH = () => ({
  code: 401,
  data: null,
  message: "Unauthorized",
});

const ERROR = (message = null) => ({
  code: 400,
  data: null,
  message,
});

module.exports = {
  OK,
  UNAUTH,
  ERROR,
};
