const express = require('express');
const app = express();
const shortId = require('shortid');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = 3000;
var users = [];
var auth = [];
var items = []

app.listen(port, () => console.log('ToDo App listening on port 3000'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//app.use(express.static('../ToDo'));

app.post('/api/v1/register', (req, res) => {
    //console.log(req.body);
    if (findUserByEmail(req.body.email)) {
        return res.sendStatus(403);
    }
    user = createUser(req.body);
    res.json(user);
});

app.post('/api/v1/login', (req, res) => {
    console.log(users);
    let user = findUserByEmail(req.body.email);
    //console.log(user);
    if (!user) {
        return res.sendStatus(403);
    }

    let cred = findAuth(user.id);
    if (!cred) {
        return res.sendStatus(403);
    }

    if (cred.password == req.body.password) {
        return res.json(user);
    }

    return res.sendStatus(403);
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

function createUser(data) {
    let id = shortId.generate();

    let user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        id: id,
    }

    let cred = {
        id: id,
        password: data.password
    }

    let list = {
        id: id,
        items: []
    }

    users.push(user);
    auth.push(cred);
    items.push(list);


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

function findUserByEmail(email) {
    let found ;
    users.forEach(user => {
        console.log(user);
        if (user.email == email) {
            found = user;
            return;
        }
    });
    return found;
}

function findAuth(cred) {
    let found = false;
    auth.forEach(a => {
        if (cred == a.id){
            found = cred;
            return;
        }
    });
    return found;
}