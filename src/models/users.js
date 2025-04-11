// models/user.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../connection/connection.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastMinedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  minedToday: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sessionStartAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  prevSessionEndAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastPingAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});