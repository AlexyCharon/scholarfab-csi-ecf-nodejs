import { compare } from 'bcrypt'

import { fetchUserByEmail } from '../services/user.service.mjs'
import { fetchAllNotes } from '../services/notes.service.mjs'

async function handleLogin(req, res) {
    const { app, method } = req
    const db = app.get('g:db')

    if(req.session.user) { return res.redirect('/') }
    if(method == 'GET') { return res.render('login') }

    const { email, password } = req.body

    const user = await fetchUserByEmail(db, email)

    if(user) {
        const ok = await compare(password, user.password)
        if(ok) {
            req.session.user = user
            return res.redirect('/')
        }
    }

    res.redirect('/login')
}

async function handlaNote(req, res) {
    const { app, method } = req
    const db = app.get('g:db')

    if(method == 'GET') { return res.render('notes') }

    const { title, content, owner_id } = req.body

    const notes = await fetchAllNotes(db)

    if(user) {
        const ok = await compare(title, notes.title)
        
    }

    res.redirect('/notes')
}

async function handleLogout(req, res) {
    req.session.user = null
    res.redirect('/')
}

export function loadSecurityController(app) {
    app.all('/login', handleLogin)
    app.get('/logout', handleLogout)
}
