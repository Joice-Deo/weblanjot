 import express from "express";

 import {
 getAllProducts,
 tambahprodibaru,
 cariProdiByID,
 updateProdi,
 deleteProdi
 } from "../controllers/prodis.controllers.js";
 const router = express.Router(); 
 router.get("/", getAllProducts);
 router.post("/", tambahprodibaru);
 router.get("/:id", cariProdiByID);
 router.patch("/:id", updateProdi);
 router.delete("/:id", deleteProdi);


 export default router;