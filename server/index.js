const express = require('express');
const app = express();
const shortId = require('shortid');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const pgSession = require('connect-pg-simple')(session);

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

app.use(session({
    secret: 'nbcai1819hcnalmc9',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: false,
        maxAge: 1000 * 60 * 10 // cookie valid for 10 mins
    },
    name: 'session-id',
    rolling: true,
    store: new pgSession({
        tableName: 'Session'
    })
}));

const port = 3000;

app.listen(port, () => console.log('ToDo App listening on port 3000'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/api/v1/register', async (req, res) => {
    //console.log(req.body);
    let user = await findUserByEmail(req.body.email);
    if (user) {
        return res.status(406).json('Email already exists');
    }
    await createUser(req.body);
    return res.status(200).send();
});

app.post('/api/v1/login', async (req, res) => {
    let user = await findUserByEmail(req.body.email);
    console.log(req.session);

    if (!user) {
        return res.status(406).json('User not found');
    }
    if (await bcrypt.compare(req.body.password, user.Password)) {
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
    req.session.destroy();
    return res.sendStatus(200);
});

app.get('/api/v1/items/:uid', async (req, res) => {
    let userItems = await findItems(req.params.uid);
    if (userItems == 'null') {
        return res.sendStatus(403);
    }

    let cleanUserItems = [];
    for (let i = 0; i < userItems.length; i++) {
        cleanUserItems.push({
            date: userItems[i].Date,
            description: userItems[i].Description,
            id: userItems[i].ItemId,
            title: userItems[i].Title
        });
    }

    return res.json(cleanUserItems);
});

app.post('/api/v1/items/:uid', async (req, res) => {
    item = req.body;
    let err = await createItem(req.params.uid, item);

    if (err) return res.json(err);

    return res.status(200).send();
});

app.get('/api/v1/items/:uid/:iid', async (req, res) => {
    let item = await findItem(req.params.iid);
    if (item == null) {
        return res.status(500).send();
    }

    if (item.UserId != req.params.uid) {
        return res.status(403).send();
    } else {
        return res.json({
            date: item.Date,
            description: item.Description,
            id: item.ItemId,
            title: item.Title
        });
    }

});

async function createUser(data) {
    let id = shortId.generate();
    let password = bcrypt.hashSync(data.password, 10);
    try {
        await client.query(`INSERT INTO public."User"("UserId", "FirstName", "LastName", "Password", "Email")
        VALUES ('${id}', '${data.firstName}', '${data.lastName}', '${password}', '${data.email}');`);
    } catch (err) {
        return err;
    }
}

async function createItem(userId, data) {
    let id = shortId.generate();
    try {
        await client.query(`INSERT INTO public."ToDoItem"(
            "ItemId", "Description", "Title", "Date", "UserId")
            VALUES ('${id}', '${data.description}', '${data.title}', '${data.date}', '${userId}');`);
    } catch (err) {
        return null;
    }
}

async function findItem(iid) {
    try {
        let item = await client.query(`select * from public."ToDoItem" where "ToDoItem"."ItemId" = '${iid}'`);
        return item.rows[0];
    } catch (err) {
        return err;
    }
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

async function findItems(id) {
    try {
        items = await client.query(`select * from public."ToDoItem" where "ToDoItem"."UserId" = '${id}'`);
        return items.rows;
    } catch (err) {
        return null;
    }
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