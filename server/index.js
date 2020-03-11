const express = require('express');
const app = express();
const shortId = require('shortid');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = 3000;
var users = [];

app.listen(port, () => console.log('ToDo App listening on port 3000'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//app.use(express.static('../ToDo'));

app.get('/api/v1', (req, res) => {
    console.log('endpoint hit');
    user = createUser();
    res.json(user);
});

app.get('/api/v1/items/:uid', (req, res) => {
    if (req.params.uid) {
        let userFound = false;
        users.forEach(user => {
            if (user.id == req.params.uid) {
                userFound = true;
            
                res.json(user.items);
                return;
            }
        });

        if (userFound) {
            return;
        }
    }
    res.sendStatus(400);
});

app.post('/api/v1/items/:uid', (req, res) => {
    item = req.body;
    item.id = shortId.generate();

    let user = findUser(req.params.uid);
    user.items.push(item);

    res.json(item);
});

app.get('/api/v1/items/:uid/:iid', (req, res) => {

    let user = findUser(req.params.uid);

    console.log(user);
    res.json(findItem(user, req.params.iid));
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

function findItem(user, iid) {
    let found;
    user.items.forEach(item => {
        if (item.id == iid) {
            found = item;
            return;
        }
    });

    console.log(found);
    return found;
}

function findUser(uid) {
    let found;
    users.forEach(user => {
        if (user.id == uid) {
            found = user;
            return;
        }
    });

    return found;
}