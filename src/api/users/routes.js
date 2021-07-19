const routes = (handler) => [
  {
    method: "post",
    path: "/users",
    handler: handler.postUserHandler,
  },
];

module.exports = routes;
