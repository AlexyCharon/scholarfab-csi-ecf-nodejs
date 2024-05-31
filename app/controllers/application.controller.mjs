// Votre travail doit être effectué principalement dans ce fichier ...

export function loadApplicationController(app) {

    app.get('/notes', async (req, res) => {
        const { user } = req.session
        const notes = await fetchAllNotes(db)
        res.render('notes', { user })
    })

    app.post('/add-note', (req, res) => {
        const note = req.body.note;
        notes.push(note);
        res.redirect('/');
    });

    //Route pour la visualisation d’une note : GET /note/:id
    app.get('/note/:id', async (req, res) => {
        const note_id = req.params.id;
    
        try {
            const note = await readNotes(db, note_id);
            if (note) {
                res.send(`<h1>${note.title}</h1><p>${note.content}</p>`);
            } else {
                res.status(404).send('Note not found');
            }
        } catch (err) {
            res.status(500).send('Error reading note');
        }
    });

    //Route pour le formulaire d’édition d’une note : GET /note/:id/edit
    app.get('/note/:id/edit', async (req, res) => {
        const note_id = req.params.id;
    
        try {
            const note = await readNotes(db, note_id);
            if (note) {
                res.send(`<form action="/note/${note_id}" method="POST"><input type="hidden" name="_method" value="PUT"><input name="title" value="${note.title}"><br><textarea name="content">${note.content}</textarea><br><button type="submit">Update Note</button></form>`);
            } else {
                res.status(404).send('Note not found');
            }
        } catch (err) {
            res.status(500).send('Error reading note');
        }
    });
    
    //Interface de partage de notes : GET /share
    app.get('/share', (req, res) => {
        res.send('<form action="/share" method="POST">Note ID: <input name="note_id"><br>Share With (User ID): <input name="shared_with"><br><button type="submit">Share Note</button></form>');
    });    

    //Création d’un nouveau partage : POST /share
    app.post('/share', (req, res) => {
        const { note_id, shared_with } = req.body;
        const created_at = new Date().toISOString();
        const updated_at = created_at;
    
        db.run('INSERT INTO shares (note_id, shared_with, created_at, updated_at) VALUES (?, ?, ?, ?)', [note_id, shared_with, created_at, updated_at], function(err) {
            if (err) {
                res.status(500).send('Error sharing note');
            } else {
                res.redirect('/shares'); // Redirige vers la liste des partages après la création
            }
        });
    });

    //Formulaire d’édition d’un partage : GET /share/:id/edit
    app.get('/share/:id/edit', (req, res) => {
        const share_id = req.params.id;
    
        db.get('SELECT * FROM shares WHERE id = ?', [share_id], (err, share) => {
            if (err || !share) {
                res.status(404).send('Share not found');
            } else {
                res.send(`<form action="/share/${share_id}" method="POST"><input type="hidden" name="_method" value="PUT"><input name="note_id" value="${share.note_id}"><br><input name="shared_with" value="${share.shared_with}"><br><button type="submit">Update Share</button></form>`);
            }
        });
    });
    
    //Mise à jour d’une note : PUT /note/:id
    app.put('/note/:id', async (req, res) => {
        const note_id = req.params.id;
        const { title, content, owner_id } = req.body;
        const updated_at = new Date().toISOString();
    
        try {
            await updateNotes(db, note_id, { title, content, owner_id, archived_at: null, updated_at });
            res.redirect(`/note/${note_id}`);
        } catch (err) {
            res.status(500).send('Error updating note');
        }
    });

    //Mise à jour d’un partage : PUT /share/:id
    app.put('/share/:id', (req, res) => {
        const share_id = req.params.id;
        const { note_id, shared_with } = req.body;
        const updated_at = new Date().toISOString();
    
        db.run('UPDATE shares SET note_id = ?, shared_with = ?, updated_at = ? WHERE id = ?', [note_id, shared_with, updated_at, share_id], function(err) {
            if (err) {
                res.status(500).send('Error updating share');
            } else {
                res.redirect(`/share/${share_id}`);
            }
        });
    });
    
}

