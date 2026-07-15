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


