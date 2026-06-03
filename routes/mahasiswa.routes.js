 import express from "express";

 import {
 getAllProducts,
 tambahMahasiswabaru,
 cariMahasiswaByID,
 updateMahasiswa,
 deleteMahasiswa
 } from "../controllers/mahasiswa.controllers.js";
 const router = express.Router(); 
 router.get("/", getAllProducts);
 router.post("/", tambahMahasiswabaru);
 router.get("/:id", cariMahasiswaByID);
 router.patch("/:id", updateMahasiswa);
 router.delete("/:id", deleteMahasiswa);


 export default router;