import { Sequelize, DataTypes } from "sequelize";
import sequelize from "./sequelize";

let Users;
try {
  Users = sequelize.define(
    "users",
    {
      discord_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      discord_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      discord_tag: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      discord_profile_picture: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      last_login: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      last_updated: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      steam_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      playtime: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      quote: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "users",
    }
  );
} catch (err) {
  console.error(err);
}

export default Users;
