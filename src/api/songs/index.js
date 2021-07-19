const SongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "songs",
  version: "1.0.0",
  register: async (server, { songsService, validator }) => {
    const songsHandler = new SongsHandler(songsService, validator);
    server.route(routes(songsHandler));
  },
};
