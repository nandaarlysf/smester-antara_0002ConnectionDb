import express from 'express'
import pg from 'pg'
const app = express()
const port = 3001
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Mahasiswa',
    password: 'Nanda123', //sesuaikan dengan password postgres kalian
    port: 5432,
})
app.get('/', (req, res) => {
    console.log('TEST DATA :');
    pool.query('SELECT * FROM biodata')
        .then(testData => {
            console.log(testData.rows);
            res.json(testData.rows);
        })
        .catch(err => {
            console.error("Error executing query", err.stack);
            res.status(500).send("Database Error");
        });
});        
app.listen(port, () => {
   console.log(`CIHUY BERJALAN on port ${port}.`);
})
//post
//put
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware agar Express bisa membaca data berformat JSON dari request body
app.use(express.json());

// Database sementara (Array in-memory)
let databaseBuku = [
    { id: 1, judul: "Pemrograman Node.js", penulis: "John Doe" },
    { id: 2, judul: "Belajar Express JS", penulis: "Jane Doe" }
];
// ==========================================
// 1. GET - Ambil semua data buku
// ==========================================
app.get('/api/books', (req, res) => {
    res.status(200).json({
        success: true,
        data: databaseBuku
    });
});

// ==========================================
// 2. GET - Ambil satu buku berdasarkan ID
// ==========================================
app.get('/api/books/:id', (req, res) => {
    const idBuku = parseInt(req.params.id);
    const buku = databaseBuku.find(b => b.id === idBuku);

    if (!buku) {
        return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: buku });
});
// ==========================================
// 3. POST - Tambah buku baru
// ==========================================
app.post('/api/books', (req, res) => {
    const { judul, penulis } = req.body;

    if (!judul || !penulis) {
        return res.status(400).json({ success: false, message: "Judul dan penulis wajib diisi" });
    }

    const bukuBaru = {
        id: databaseBuku.length > 0 ? databaseBuku[databaseBuku.length - 1].id + 1 : 1,
        judul,
        penulis
    };

    databaseBuku.push(bukuBaru);

    res.status(201).json({
        success: true,
        message: "Buku berhasil ditambahkan",
        data: bukuBaru
    });
});

// ==========================================
// 4. PUT - Perbarui data buku berdasarkan ID
// ==========================================
app.put('/api/books/:id', (req, res) => {
    const idBuku = parseInt(req.params.id);
    const { judul, penulis } = req.body;

    const indexBuku = databaseBuku.findIndex(b => b.id === idBuku);

    if (indexBuku === -1) {
        return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });
    }

    // Update data buku
    databaseBuku[indexBuku] = {
        ...databaseBuku[indexBuku],
        judul: judul || databaseBuku[indexBuku].judul,
        penulis: penulis || databaseBuku[indexBuku].penulis
    };

    res.status(200).json({
        success: true,
        message: "Buku berhasil diperbarui",
        data: databaseBuku[indexBuku]
    });
});

// ==========================================
// 5. DELETE - Hapus buku berdasarkan ID
// ==========================================
app.delete('/api/books/:id', (req, res) => {
    const idBuku = parseInt(req.params.id);
    const indexBuku = databaseBuku.findIndex(b => b.id === idBuku);

    if (indexBuku === -1) {
        return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });
    }

    // Hapus dari array
    databaseBuku.splice(indexBuku, 1);

    res.status(200).json({
        success: true,
        message: `Buku dengan ID ${idBuku} berhasil dihapus`
    });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

