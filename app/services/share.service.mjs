import { hash } from 'bcrypt'

export function fetchAllShares (db) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('SELECT * FROM Share')
        stmt.get([ Share ], (err, data) => {
            const p = err ? err : data;
            (err ? reject : resolve)(p)
        })
    })
}

//Fonction permet de créer une share spécifique
export function createShare(db, { permission, created_at }) {
    return new Promise(async (resolve, reject) => {
        const stmt = db.prepare('INSERT INTO Share (permission, created_at) VALUES (?,?)')
        stmt.run([ permission, created_at ], (err, data) => {
            const p = err ? err : data;
            (err ? reject : resolve)(p)
        })
    })
}

//Fonction permet de récupérer une share spécifique ou toutes les Shares
export function readShare(db, share_id = null) {
    return new Promise((resolve, reject) => {
        let stmt;
        if (share_id) {
            stmt = db.prepare('SELECT * FROM Share WHERE id = ?');
            stmt.get([share_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        } else {
            stmt = db.prepare('SELECT * FROM Share');
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