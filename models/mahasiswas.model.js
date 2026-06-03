import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import ref_prodi from "./prodis.model.js";
const { DataTypes } = Sequelize;
const mahasiswa = db.define(
  "mahasiswas",
  {
    nim: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    tempat_lahir: {
      type: DataTypes.INTEGER,
    },
    tgl_lahir: {
      type: DataTypes.DATE,
    },
    prodi_id: {
      type: DataTypes.INTEGER,
    },
    th_masuk: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },  
  },
  {
    freezeTableName: true,
  },
);
ref_prodi.hasMany(mahasiswa,{ foreignKey: 'prodi_id'});
mahasiswa.belongsTo(ref_prodi,{foreignKey:'prodi_id'});
export default mahasiswa;
