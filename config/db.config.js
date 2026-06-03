import { Sequelize } from "sequelize";
import mysql2 from 'mysql2';
const db = new Sequelize('web_lanjut', 'avnadmin', 'AVNS_b_-o4_FtcjgzqiuL0DA', {
    host: "mysql-10db1ea7-weblanjut2.h.aivencloud.com",
    dialect: "mysql",
    port: 17510,
    dialectOptions: {
ssl: {
rejectUnauthorized: false
 }
 },
    "define": {
        "timestamps": false
    }
    });
    export default db;

    (async()=>{
        await db.sync();
        })();
