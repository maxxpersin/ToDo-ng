const express = require('express');
const app = express();
const shortId = require('shortid');
const cookieParser = require('cookie-parser');
const port = 3000;
var users = [];

app.listen(port, () => console.log('ToDo App listening on port 3000'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static('../ToDo'));

app.get('/api/v1', (req, res) => {
    console.log('endpoint hit');
    user = createUser();
    res.cookie('id', user.id);
    res.header({
        'Access-Control-Allow-Origin': '*',
    });
    res.json(user);
});

app.get('/api/v1/items/:uid', (req, res) => {

});

app.get('/api/v1/auth', (req, res) => {
    if (req.cookie && req.cookie.id) {
        let userFound = false;
        users.forEach(user => {
            if (user.id == req.cookie.id) {
                userFound = true;
                res.json(user);
                return;
            }
        });

        if (userFound) {
            return;
        }
    }

    let user = createUser();

    res.cookie('id', user.id);
    res.json(user);
});

app.post('/api/v1/createitem', (req, res) => {
    let newItem = req.body;
    newItem.id = shortId.generate();
    
    users.forEach(user => {
        if (user.id == req.cookies.id) {
            user.items.push(newItem);
        }
    });

    console.log(users);

    res.sendStatus(200);
});

function createUser() {
    let id = shortId.generate();

    let user = {
        id: id,
        items: []
    };

    users.push(user);
    return user;
}