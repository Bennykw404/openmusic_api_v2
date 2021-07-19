const ClientError = require("../../exceptions/ClientError");

class PlaylistsHandler {
  constructor(playlistsService, validator) {
    this.playlistsService = playlistsService;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this.validator.validatePlaylistPayload(request.payload);

      const { name } = request.payload;
      const { id: owner } = request.auth.credentials;

      const playlistId = await this.playlistsService.addPlaylists(name, owner);

      const response = h.response({
        status: "success",
        message: "Playlist berhasil ditambahkan",
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this.playlistsService.getPlaylists(owner);

    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { id: owner } = request.auth.credentials;
      const { playlistId } = request.params;

      await this.playlistsService.deletePlaylists(playlistId, owner);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this.validator.validateSongToPlaylistPayload(request.payload);

      const { playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      const { songId } = request.payload;

      await this.playlistsService.verifyPlaylistAccess(playlistId, owner);
      await this.playlistsService.addSongToPlaylist(playlistId, songId);

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getSongsFromPlaylistHandler(request, h) {
    try {
      const { id: owner } = request.auth.credentials;
      const { playlistId } = request.params;

      await this.playlistsService.verifyPlaylistAccess(playlistId, owner);
      const songs = await this.playlistsService.getSongsFromPlaylist(playlistId);

      return {
        status: "success",
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      this.validator.validateSongToPlaylistPayload(request.payload);

      const { id: owner } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;

      await this.playlistsService.verifyPlaylistAccess(playlistId, owner);
      await this.playlistsService.deleteSongsFromPlaylist(playlistId, songId);

      return {
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistsHandler;
