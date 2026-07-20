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
const db = require('./config/db');

const app = express();
app.use(express.json()); // Middleware untuk membaca JSON body

const PORT = 3000;

// ==========================================
// 1. GET ALL BOOKS (Membaca semua data)
// ==========================================
app.get('/api/books', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM books');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 2. GET BOOK BY ID (Membaca satu data spesifik)
// ==========================================
app.get('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 3. POST (Menambah data baru)
// ==========================================
app.post('/api/books', async (req, res) => {
    const { judul, penulis, stok } = req.body;
    
    if (!judul || !penulis) {
        return res.status(400).json({ success: false, message: 'Judul dan penulis wajib diisi' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO books (judul, penulis, stok) VALUES (?, ?, ?)',
            [judul, penulis, stok || 0]
        );
        res.status(201).json({
            success: true,
            message: 'Buku berhasil ditambahkan',
            data: { id: result.insertId, judul, penulis, stok }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 4. PUT (Mengupdate data secara keseluruhan)
// ==========================================
app.put('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    const { judul, penulis, stok } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE books SET judul = ?, penulis = ?, stok = ? WHERE id = ?',
            [judul, penulis, stok, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
        }

        res.status(200).json({ success: true, message: 'Buku berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 5. DELETE (Menghapus data)
// ==========================================
app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
        }

        res.status(200).json({ success: true, message: 'Buku berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Menjalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});