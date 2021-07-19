/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("playlistsongs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlists_id: {
      type: "VARCHAR(50)",
    },
    song_id: {
      type: "VARCHAR(50)",
    },
  });

  // memberikan constraint foreign key pada kolom paylists_id
  pgm.addConstraint("playlistsongs", "fk_playlists.playlists_id_playlists.id", "FOREIGN KEY(playlists_id) REFERENCES playlists(id) ON DELETE CASCADE");

  // memberikan constraint foreign key pada kolom song_id
  pgm.addConstraint("playlistsongs", "fk_songs.song_id_songs.id", "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
  pgm.dropTable("playlistsongs");
};
