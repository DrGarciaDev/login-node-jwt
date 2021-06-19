const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, resp) => {
    resp.json({
        mensaje: 'Node js and jwt'
    });
});

app.post('/api/login', (req, resp) => {
    const user = {
        id: 1,
        nombre: 'Luis',
        email: 'luis@correo.com'
    }

    jwt.sign({ user: user }, 'secretKey', { expiresIn: '32s' }, (err, token) => {
        resp.json({
            token: token
        });
    });
});

app.post('/api/post', verifyToken, (req, resp) => {
    jwt.verify(req.token, 'secretKey', (error, authData) => {
        if (error) {
            resp.sendStatus(403);
        } else {
            resp.json({
                mensaje: "Post creado",
                authData: authData
            });
        }
    });
});

function verifyToken(req, resp, next) {
    const bearerHeader = req.headers['autorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        resp.sendStatus(403);
    }
}

app.listen(3000, function() {
    console.log('Escuchando en el puerto 3000');
});