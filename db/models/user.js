"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const { v4: uuidv4 } = require("uuid");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuidv4, // Ensure UUID default value
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: { msg: "Email is required" },
        notEmpty: { msg: "Email is required" },
        isEmail: { msg: "Invalid email" },
      },
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        len: { args: [10, 10], msg: "Mobile number must be 10 digits" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "reset_token", // Explicitly map to PostgreSQL column
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "reset_token_expiry", // Explicitly map to PostgreSQL column
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
    modelName: "User",
    timestamps: true,
  }
);

module.exports = User;