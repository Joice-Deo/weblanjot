import { Sequelize } from "sequelize";
import Mahasiswa from "../models/mahasiswas.model.js";
import ref_prodi from "../models/prodis.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Mahasiswa.findAll({
      include:{model:ref_prodi},
    });
    res.json(products);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const tambahMahasiswabaru = async (req, res) => {
  try {
    const products = await Mahasiswa.create(req.body);
    res.json({ message: "Mahasiswa berhasil disimpan" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const cariMahasiswaByID = async (req, res) => {
  try {
    const products = await Mahasiswa.findAll({
      where: {
        nim: req.params.id,
      },
    });
    res.json(products[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateMahasiswa = async (req, res) => {
  try {
    const products = await Mahasiswa.update(req.body, {
      where: {
        nim: req.params.id,
      },
    });
    res.json({ message: "Mahasiswa berhasil update" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteMahasiswa = async (req, res) => {
  try {
    const products = await Mahasiswa.destroy({
      where: {
       nim: req.params.id,
      },
    });
    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
