import mahasiswa from "../models/mahasiswas.model.js";
import Pinjams from "../models/pinjams.models.js";
import { Sequelize } from "sequelize";
import Detail_pinjams from "../models/detail_pinjams.models.js";
import Buku from "../models/buku.model.js";

export const getAllPinjam = async (req, res) => {
  try {
    const data = await Pinjams.findAll({
      include: [mahasiswa, { model: Detail_pinjams, include: "buku" }],
    });
    res.json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const tambahpinjambaru = async (req, res) => {
  try {
    const data = await Pinjams.create(req.body);
    res.json({ message: "Data Pinjam berhasil disimpan" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const cariPinjamByID = async (req, res) => {
  try {
    const data = await Pinjams.findAll({
      include: [mahasiswa, { model: Detail_pinjams, include: "buku" }],
      where: {
        nim: req.params.id,
      },
    });
    res.json(data[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updatePinjam = async (req, res) => {
  try {
    await Pinjams.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Data Pinjam berhasil diupdate" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deletePinjam = async (req, res) => {
  try {
    await Pinjams.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Data Pinjam berhasil dihapus" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
export const insertPinjam = async (req, res) => {
  try {
    const tanggalPinjam = new Date();
    const tanggalKembali = new Date();

    tanggalKembali.setDate(tanggalKembali.getDate() + 7);

    const pinjam = await Pinjams.create(
      {
        tanggal_pinjam: tanggalPinjam,
        tanggal_kembali: tanggalKembali,
        nim: req.body.nim,
        pegawai_id: req.body.pegawai_id,

        detail_pinjams: req.body.detail_pinjams,
      },
      {
        include: [
          {
            model: Detail_pinjams,
            as: "detail_pinjams",
          },
        ],
      },
    );

    for (const item of req.body.detail_pinjams) {
      await Buku.decrement("jumlah", {
        by: item.jml_pinjam,
        where: { kode_buku: item.buku_id },
      });
    }

    res.json({
      message: "Peminjaman berhasil",
      data: req.body.detail_pinjams,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};





//INII PENGEMBALIANNN
export const updatePengembalian = async (req, res) => {
  try {
    const details = await Detail_pinjams.findAll({
      where: { pinjam_id: req.params.id },
    });

    if (details.length === 0) {
      return res
        .status(404)
        .json({ message: "Data peminjaman tidak ditemukan!" });
    }

    let SudahPernah = false;

    for (const detail of details) {
      const updated = await Detail_pinjams.update(
        { status: "0" },
        {
          where: {
            id: detail.id,
            status: "1",
          },
        },
      );

      if (updated[0] === 0) {
        SudahPernah = true;
        continue;
      }

      await Detail_pinjams.update(
        { status: "0" },
        { where: { id: detail.id } },
      );

      await Buku.increment("jumlah", {
        by: detail.jml_pinjam,
        where: { kode_buku: detail.buku_id },
      });
    }

    if (SudahPernah) {
      return res.status(400).json({
        message: "buku dalam nota ini sudah pernah dikembalikan!",
      });
    }

    res.status(200).json({
      message: "Buku berhasil dikembalikan!",
      data: details,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




//Cari buku yang dipinjam by nim
export const cariBukuDipinjam = async (req, res) => {
  try {
    const data = await Pinjams.findAll({
      attributes: [],

      where: {
        nim: req.params.nim,
      },

      include: [
        {
          model: mahasiswa,
          as: "mahasiswa",
          attributes: ["nama"],
        },

        {
          model: Detail_pinjams,
          as: "detail_pinjams",
          attributes: ["id", "jml_pinjam", "status"],

          where: {
            status: 1,
          },

          include: [
            {
              model: Buku,
              attributes: ["judul"],
            },
          ],
        },
      ],
    });

    res.json(data);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
//Pengembalian
export const pengembalianBuku = async (req, res) => {
    try {
      for (const item of req.body.buku_kembali) {
        // cari detail pinjam
        const detail = await Detail_pinjams.findOne({
          where: {
            id: item.detail_pinjam_id,
            status: 1,
          },
        });

        if (!detail) {
          return res.json({
            message: "Data pinjam tidak ditemukan",
          });
        }

        // validasi
        if (item.jml_kembali > detail.jml_pinjam) {
          return res.json({
            message: "Jumlah lebih besar dari jumlah pinjam",
          });
        }

        // jika kembali semua
        if (item.jml_kembali == detail.jml_pinjam) {
          await Detail_pinjams.update(
            {
              status: 2,
            },
            {
              where: {
                id: detail.id,
              },
            },
          );
        } else {
          // insert riwayat pengembalian
          await Detail_pinjams.create({
            pinjam_id: detail.pinjam_id,
            buku_id: detail.buku_id,
            jml_pinjam: item.jml_kembali,
            status: 2,
          });

          // update sisa pinjaman
          await Detail_pinjams.update(
            {
              jml_pinjam: detail.jml_pinjam - item.jml_kembali,
            },
            {
              where: {
                id: detail.id,
              },
            },
          );
        }

        // tambah stok buku
        await Buku.increment("jumlah", {
          by: item.jml_kembali,
          where: {
            kode_buku: detail.buku_id,
          },
        });
      }

      res.json({
        message: "Pengembalian berhasil",
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  };
  //Laporan
  export const laporan_Pengembalian = async (req, res) => {
  try {
    const data = await Pinjams.findAll({
      attributes: ["tanggal_pinjam", "tanggal_kembali"],

      include: [
        {
          model: mahasiswa,

          as: "mahasiswa",

          attributes: ["nama"],
        },

        {
          model: Detail_pinjams,

          as: "detail_pinjams",

          where: {
            status: 2,
          },

          attributes: ["id","jml_pinjam", "updated_at"],

          include: [
            {
              model: Buku,

              as: "buku",

              attributes: ["judul"],
            },
          ],
        },
      ],
    });

    const hasil = data.map((p) => ({
      nama_mahasiswa: p.mahasiswa?.nama || "-",

      tanggal_pinjam: p.tanggal_pinjam,

      buku: (p.detail_pinjams || []).map((d) => {
        // tanggal batas pengembalian
        const batasKembali = new Date(p.tanggal_kembali);

        // tanggal sekarang (real time)
        const sekarang = new Date(0);

        // hitung selisih hari
        const tanggalPengembalian = new Date(d.updated_at);

        let terlambat = Math.ceil(
          (tanggalPengembalian - batasKembali) / (1000 * 60 * 60 * 24),
        );
        
        //let terlambatBulan = Math.ceil (terlambat / 30);

        // let terlambatTahun = (terlambat / 365) .toFixed(1);

        // jika belum terlambat
        if (terlambat < 0) {
          terlambat = 0;
          // terlambatBulan = 0;
          // terlambatTahun = "0.0";
        }

        return {
          id_dipinjam: d.id,

          judul_buku: d.buku?.judul || "-",

          jumlah_pinjam: d.jml_pinjam,

          tanggal_pengembalian: d.updated_at,

          jumlah_hari_terlambat: terlambat,

          //jumlah_bulan_terlambat: terlambatBulan,

          // jumlah_tahun_terlambat: terlambatTahun,
        };
      }),
    }));

    res.json(hasil);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};