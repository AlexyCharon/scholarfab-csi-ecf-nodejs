import { hash } from 'bcrypt'

export function fetchAllNotes (db) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('SELECT * FROM notes')
        stmt.get([ notes ], (err, data) => {
            const p = err ? err : data;
            (err ? reject : resolve)(p)
        })
    })
}

//Fonction permet de créer une note spécifique
export function createNote(db, { title, content, owner_id, archived_at, created_at, updated_at }) {
    return new Promise(async (resolve, reject) => {
        const stmt = db.prepare('INSERT INTO notes (title, content, owner_id, archived_at, created_at, updated_at) VALUES (?,?,?,?,?,?)')
        stmt.run([ title, content, owner_id ], (err, data) => {
            const p = err ? err : data;
            (err ? reject : resolve)(p)
        })
    })
}

//Fonction permet de récupérer une note spécifique ou toutes les notes
export function readNote(db, note_id = null) {
    return new Promise((resolve, reject) => {
        let stmt;
        if (note_id) {
            stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
            stmt.get([note_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        } else {
            stmt = db.prepare('SELECT * FROM notes');
            stmt.all((err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        }
    });
}

//Fonction permet de mettre à jour une note spécifique 
export function updateNote(db, note_id, { title, content, owner_id, archived_at, updated_at }) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('UPDATE notes SET title = ?, content = ?, owner_id = ?, archived_at = ?, updated_at = ? WHERE id = ?');
        stmt.run([title, content, owner_id, archived_at, updated_at, note_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
}

