const express = require('express');
const app = express();
const shortId = require('shortid');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'todo'
    }
});


// db connection
// const PostgresClient = require('pg').Client;
// const client = new PostgresClient({
//     user: 'postgres',
//     password: 'admin',
//     host: 'localhost',
//     port: 5432,
//     database: 'todo'
// });
// client.connect(err => {
//     if (err) console.log('Could not connect', err);

//     console.log('Postgres connection successful')
// });

// app.use(session({
//     secret: 'sdapovin10832183csikjbasi',
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: false,
//         sameSite: false,
//         maxAge: 1000 * 15
//     },
//     name: 'session-id',
//     rolling: true,
// }));

const port = 3000;

app.listen(port, () => console.log('ToDo App listening on port 3000'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(bodyParser());

app.get('/', async (req, res) => {
    return res.json(
        await knex.select().from('User').where('Email', 'like', '%')
    );
});

app.post('/api/v1/register', async (req, res) => {
    let user = await findUserByEmail(req.body.email);
    if (user) {
        return res.status(406).json('Email already exists');
    }
    let err = await createUser(req.body);
    return res.status(200).send();
});

app.post('/api/v1/login', async (req, res) => {
    let user = await findUserByEmail(req.body.email);
    if (!user) {
        return res.status(406).json('User not found');
    }
    if (await bcrypt.compare(req.body.password, user.Password)) {
        let cleanUser = {
            id: user.UserId,
            name: `${user.FirstName} ${user.LastName}`,
            email: user.Email,
            sessionId: shortId.generate()
        };

        await knex('Session').insert({
            SessionId: cleanUser.sessionId,
            Expiration: Date.now().toString(),
            UserId: cleanUser.id
        });

        return res.json(cleanUser);
    } else {
        return res.status(406).json('Invalid password');
    }
});

app.post('/api/v1/logout', async (req, res) => {
    console.log(req.body);
    let user = req.body;
    await knex('Session').where('SessionId', 'like', `${req.body.sessionId}`, 'and', 'UserId', 'like', `${req.body.id}`).del().catch(err => console.log(err));
    return res.json('OK');
});

app.get('/api/v1/items/:uid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        let userItems = await findItems(req.params.uid);
        if (userItems == 'null') {
            return res.sendStatus(403);
        }

        return res.json(userItems);
    } else {
        return res.status(403).send();
    }
});

app.post('/api/v1/items/:uid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        item = req.body;
        let err = await createItem(req.params.uid, item);

        if (err) return res.json(err);

        return res.status(200).send();
    } else {
        return res.status(403).send();
    }
});

app.get('/api/v1/items/:uid/:iid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        let item = await findItem(req.params.iid);
        if (item == null) {
            return res.status(500).send();
        }

        if (item.userid != req.params.uid) {
            return res.status(403).send();
        } else {
            return res.json(item);
        }
    } else {
        return res.status(403).send();
    }
});

app.delete('/api/v1/items/:uid/:iid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        let item = await findItem(req.params.iid);
        if (item == null) {
            return res.status(200).send();
        }

        if (item.userid != req.params.uid) {
            return res.status(403).send();
        } else {
            await deleteItem(item.id);
            return res.status(200).send();
        }
    } else {
        return res.status(403).send();
    }
});

async function deleteItem(iid) {
    try {
        await knex('ToDoItem').where({ ItemId: iid }).del();
        // await client.query(`DELETE FROM public."ToDoItem" WHERE "ItemId" = '${iid}'`);
    } catch (err) {

    }
}

function validSession(sessionId, userId) {
    return true;
}

async function createUser(data) {
    let id = shortId.generate();
    let password = bcrypt.hashSync(data.password, 10);
    try {
        await knex('User').insert({
            UserId: id,
            FirstName: data.firstName,
            LastName: data.lastName,
            Password: password,
            Email: data.email
        });
        // await client.query(`INSERT INTO public."User"("UserId", "FirstName", "LastName", "Password", "Email")
        // VALUES ('${id}', '${data.firstName}', '${data.lastName}', '${password}', '${data.email}');`);
    } catch (err) {
        return err;
    }
}

async function createItem(userId, data) {
    let id = shortId.generate();
    try {
        await knex('ToDoItem').insert({
            ItemId: id,
            Description: data.description,
            Title: data.title,
            Date: data.date,
            UserId: userId
        });
        // await client.query(`INSERT INTO public."ToDoItem"(
        //     "ItemId", "Description", "Title", "Date", "UserId")
        //     VALUES ('${id}', '${data.description}', '${data.title}', '${data.date}', '${userId}');`);
    } catch (err) {
        return null;
    }
}

async function findItem(iid) {
    try {
        let item = await knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title', 'UserId as userid').from('ToDoItem').where({ ItemId: iid });
        //let item = await client.query(`select "Date" as date, "ItemId" as id, "Description" as description, "Title" as title, "UserId" as userid from public."ToDoItem" where "ToDoItem"."ItemId" = '${iid}'`);
        return item[0];
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
        let user = await knex.select().from('User').where({ Email: email });
        //console.log(user);
        return user[0];
        //user = await client.query(`select * from public."User" where "User"."Email" = '${email}'`);
        //return user.rows[0];
    } catch (err) {
        return null;
    }
}

async function findItems(id) {
    try {
        let items = knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title').from('ToDoItem').where({ UserId: id });
        // items = await client.query(`select "Date" as date, "ItemId" as id, "Description" as description, "Title" as title from public."ToDoItem" where "ToDoItem"."UserId" = '${id}'`);
        return items;
    } catch (err) {
        return null;
    }
}
