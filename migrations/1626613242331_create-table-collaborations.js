/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("collaborations", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlists_id: {
      type: "VARCHAR(50)",
    },
    user_id: {
      type: "VARCHAR(50)",
    },
  });

  // memberikan constraint foreign key pada kolom paylists_id
  pgm.addConstraint("collaborations", "fk_playlists.playlists_id_playlists.id", "FOREIGN KEY(playlists_id) REFERENCES playlists(id) ON DELETE CASCADE");

  // memberikan constraint foreign key pada kolom user_id
  pgm.addConstraint("collaborations", "fk_users.user_id_users.id", "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
  pgm.dropTable("collaborations");
};
