const nanoid = require("nanoid");
const { Pool } = require("pg");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this.collaborationsService = collaborationsService;
  }

  async addPlaylists(name, owner) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Playlist gagal ditambah");
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id,playlists.name,users.username FROM playlists JOIN users on playlists.owner=users.id LEFT JOIN collaborations ON collaborations.playlists_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylists(playlistId, owner) {
    await this.verifyPlaylistOwner(playlistId, owner);

    const query = {
      text: "DELETE FROM playlists WHERE id=$1 AND owner=$2",
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Playlist gagal dihapus");
    }
  }

  async addSongToPlaylists(playlistId, songId) {
    const id = `playlistsongs-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlistsongs VALUES( $1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw InvariantError("Gagal menambahkan lagu ke playlist");
    }

    return result.rows[0].id;
  }

  async getSongsFromPlaylists(playlistId) {
    const query = {
      text: "SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id WHERE playlist_id=$1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteSongsFromPlaylists(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlistsongs WHERE playlist_id=$1 AND song_id=$2",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Gagal menghapus lagu dari playlist");
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id=$1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, owner) {
    try {
      await this.verifyPlaylistOwner(playlistId, owner);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this.collaborationsService.verifyCollaborator(playlistId, owner);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
