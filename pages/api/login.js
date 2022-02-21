const jwt = require('jsonwebtoken');

const KEY = 'dhegyggsgtftfgfgyesgyfyigfuyrgdh';
export default function handler(req, res) {
    if(!req.body){
        res.statusCode = 404;
        res.end('Error');
    }

    const{username, password} = req.body;


    res.json({
        token: jwt.sign({
            username,
            admin: username === 'admin' && password === 'admin'
        },
        KEY
        )
    })
  }