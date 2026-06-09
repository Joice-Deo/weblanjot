import express from "express";
import {
    getAllPinjam,
    tambahpinjambaru,
    cariPinjamByID,
    updatePinjam,
    updatePengembalian,
    deletePinjam,
    insertPinjam,
    cariBukuDipinjam,
    pengembalianBuku,
    laporan_Pengembalian 
} from "../controllers/pinjams.controllers.js";

const router = express.Router();
router.get("/", getAllPinjam);
router.patch("/kembali/:id",updatePengembalian);
//router.get("/:id", cariPinjamByID);//
//router.patch("/:id", updatePinjam);
router.delete("/:id", deletePinjam);
router.post("/", insertPinjam);
router.get("/dipinjam/:nim",cariBukuDipinjam);
router.post("/pengembalian",pengembalianBuku);
router.get("/laporan_pengembalian",authenticateToken, laporan_Pengembalian);

export default router;
