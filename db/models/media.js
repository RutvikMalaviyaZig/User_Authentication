"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const { v4: uuidv4 } = require("uuid");

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuidv4, // Ensure UUID default value
    },
    url:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    path:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    size:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mimetype:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalname:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true, // Ensures table name remains "User"
    modelName: "Media",
    timestamps: true,
  }
);

module.exports = Media;