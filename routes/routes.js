const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const MIDDLEWARE_AUTENTICACION = require('../middlewares/authMiddleware');
const USERS = require('../data/users');

ROUTER.get('/', (req, res) => {
    res.render('index', { title: 'Inicio de sesión' });
});

ROUTER.post('/login', (req, res) => {
    const { username, password } = req.body;
    const USER = USERS.find((user) => user.username === username && user.password === password);
    if (!USER) {
        return res.status(401).send(`<h1>Credenciales invalidas</h1> <a href="/">Volver</a>`);
    }
    const TOKEN = MIDDLEWARE_AUTENTICACION.GENERAR_TOKEN(USER);
    res.cookie('x-access-token', TOKEN);
    res.redirect('/dashboard');
});

ROUTER.get('/dashboard', MIDDLEWARE_AUTENTICACION.VERIFICAR_TOKEN, (req, res) => {
    res.render('dashboard', { user: req.user });
});

ROUTER.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.clearCookie('x-access-token');
            res.redirect('/');
        }
    });
});


ROUTER.post('/logout', (req, res) => {
    req.session.destroy();
    res.send({ message: 'Sesión cerrada' });
});

module.exports = ROUTER;