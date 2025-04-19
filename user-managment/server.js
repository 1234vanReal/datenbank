const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./database.sqlite');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Datenbank initialisieren
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);
});

// API-Endpunkte

// Alle Benutzer abrufen
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Benutzer hinzufügen
app.post('/api/users', (req, res) => {
    const { name, email, password } = req.body;
    db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

// Benutzer aktualisieren
app.put('/api/users/:id', (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;
    db.run(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ updated: this.changes });
        }
    );
});

// Benutzer löschen
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});