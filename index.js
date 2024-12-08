const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.HOST,        
    user: process.env.USER,        
    password: process.env.PASSWORD,
    database: process.env.DATABASE 
});


db.connect(err => {
    if (err) {
        console.error('Koneksi ke MySQL gagal:', err);
        process.exit(1); 
    }
    console.log('Terhubung ke MySQL!');
});

// Endpoint: Mendapatkan semua catatan
app.get('/notes', (req, res) => {
    const query = 'SELECT * FROM notes';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error saat mengambil data:', err);
            return res.status(500).send('Server Error');
        }
        res.json(results);
    });
});

// Endpoint: Menambahkan catatan baru
app.post('/notes', (req, res) => {
    const { title, datetime, note } = req.body;
    const query = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
    db.query(query, [title, datetime, note], (err, results) => {
        if (err) {
            console.error('Error saat menambahkan data:', err);
            return res.status(500).send('Server Error');
        }
        res.status(201).send('Catatan berhasil ditambahkan');
    });
});

// Endpoint: Menghapus catatan berdasarkan ID
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM notes WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error saat menghapus data:', err);
            return res.status(500).send('Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Catatan tidak ditemukan');
        }
        res.send('Catatan berhasil dihapus');
    });
});

// Endpoint: Memperbarui catatan berdasarkan ID
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, datetime, note } = req.body;
    const query = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
    db.query(query, [title, datetime, note, id], (err, results) => {
        if (err) {
            console.error('Error saat memperbarui data:', err);
            return res.status(500).send('Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Catatan tidak ditemukan');
        }
        res.send('Catatan berhasil diperbarui');
    });
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
