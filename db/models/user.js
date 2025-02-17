"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const { v4: uuidv4 } = require("uuid");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      allowNull: false,
      primaryKey: true,
    },
    isDeleted:{
      type : DataTypes.BOOLEAN,
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
        notNull: {
          msg: "email is required",
        },
        notEmpty: {
          msg: "email is required",
        },
        isEmail: {
          msg: "Invalid email",
        },
      },
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        len: {
          args: [10, 10],
          msg: "Mobile number must be 10 digits",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp:{
      type:DataTypes.STRING,
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
    freezeTableName: true,
    modelName: "User",
    timestamps: true,
  }
);


module.exports = User;
