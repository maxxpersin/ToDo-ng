const express = require('express');
const app = express();
const shortId = require('shortid');
const cookieParser = require('cookie-parser');

// db connection
const PostgresClient = require('pg').Client;
const client = new PostgresClient({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'todo'
});
client.connect(err => {
    if (err) console.log('Could not connect', err);

    console.log('Postgres connection successful')
});

// client.query('select * from public."User"', (err, res) => {
//     if (err) console.log(err);

//     console.log(res.rows);
// })

const port = 3000;
var users = [];
var auth = [];
var items = []

app.listen(port, () => console.log('ToDo App listening on port 3000'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/api/v1/register', async (req, res) => {
    let user = await findUserByEmail(req.body.email);
    if (user) {
        return res.status(406).json('Email already exists');
    }
    await createUser(req.body);
    return res.sendStatus(200);
});

app.post('/api/v1/login', async (req, res) => {
    let user = await findUserByEmail(req.body.email);

    if (!user) {
        return res.status(406).json('User not found');
    }
    if (user.Password == req.body.password) {
        let cleanUser = {
            id: user.UserId,
            name: `${user.FirstName} ${user.LastName}`,
            email: user.Email
        };

        return res.json(cleanUser);
    } else {
        return res.status(406).json('Invalid password');
    }
    // if (!user) {
    //     return res.sendStatus(403);
    // }

    // let cred = findAuth(user.id);
    // if (!cred) {
    //     return res.sendStatus(403);
    // }

    // if (cred.password == req.body.password) {
    //     return res.json(user);
    // }

    // return res.sendStatus(403);
});

app.post('/api/v1/logout', async (req, res) => {

});

app.get('/api/v1/items/:uid', (req, res) => {
    let userItems = findItems(req.params.uid);
    if (userItems == 'undefined') {
        return res.sendStatus(403);
    }

    return res.json(userItems.items);
});

app.post('/api/v1/items/:uid', (req, res) => {
    item = req.body;
    item.id = shortId.generate();

    let userItems = findItems(req.params.uid);
    if (userItems == 'undefined') {
        return res.sendStatus(404);
    }
    userItems.items.push(item);

    return res.json(item);
});

app.get('/api/v1/items/:uid/:iid', (req, res) => {

    let user = findUser(req.params.uid);

    console.log(user);
    res.json(findItem(user.id, req.params.iid));
});

async function createUser(data) {
    let id = shortId.generate();
    try {
        await client.query(`INSERT INTO public."User"("UserId", "FirstName", "LastName", "Password", "Email")
        VALUES ('${id}', '${data.firstName}', '${data.lastName}', '${data.password}', '${data.email}');`);
    } catch (err) {
        return err;
    }

    // let user = {
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     email: data.email,
    //     id: id,
    // }

    // let cred = {
    //     id: id,
    //     password: data.password
    // }

    // let list = {
    //     id: id,
    //     items: []
    // }

    // users.push(user);
    // auth.push(cred);
    // items.push(list);

}

function findItem(userId, iid) {
    let found;
    items.forEach(item => {
        if (item.id == userId) {
            item.items.forEach(i => {
                if (i.id == iid) {
                    found = i;
                    return;
                }
            });
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

async function findUserByEmail(email) {
    try {
        let user = await client.query(`select * from public."User" where "User"."Email" = '${email}'`);
        return user.rows[0];
    } catch (err) {
        return null;
    }


    // let found;
    // users.forEach(user => {
    //     if (user.email == email) {
    //         found = user;
    //         return;
    //     }
    // });
    // return found;
}

function findItems(id) {
    let found;
    items.forEach(item => {
        if (item.id == id) {
            found = item;
            return;
        }
    });
    return found;
}

function findAuth(cred) {
    let found = false;
    auth.forEach(a => {
        if (cred == a.id) {
            found = a;
            return;
        }
    });
    return found;
}