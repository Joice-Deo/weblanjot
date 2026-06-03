import { Sequelize } from "sequelize";
import Prodi from "../models/prodis.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Prodi.findAll();
    res.json(products);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const tambahprodibaru = async (req, res) => {
  try {
    const products = await Prodi.create(req.body);
    res.json({ message: "Prodi berhasil disimpan" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const cariProdiByID = async (req, res) => {
  try {
    const products = await Prodi.findAll({
      where: {
        kode_prodi: req.params.id,
      },
    });
    res.json(products[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateProdi = async (req, res) => {
  try {
    const products = await Prodi.update(req.body, {
      where: {
        kode_prodi: req.params.id,
      },
    });
    res.json({ message: "Prodi berhasil update" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteProdi = async (req, res) => {
  try {
    const products = await Prodi.destroy({
      where: {
        kode_prodi: req.params.id,
      },
    });
    res.json({ message: "Prodi berhasil dihapus" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
