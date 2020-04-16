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
    let user = req.body;
    await knex('Session').where('SessionId', 'like', `${req.body.sessionId}`, 'and', 'UserId', 'like', `${req.body.id}`).del().catch(err => console.log(err));
    return res.json('OK');
});

app.get('/api/v1/groups/:uid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        let groups = await findGroups(req.params.uid);
        if (!groups) {
            return res.status(500).send();
        }
        return res.json(groups);
    } else {
        return res.status(403).send();
    }
});

app.post('/api/v1/groups/:uid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        await createGroup(req.params.uid, req.body);
        return res.status(200).send();
    } else {
        return res.status(403).send();
    }

});

app.get('/api/v1/items/:uid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        if (!req.query.order || !properOrderInput(req.query.order)) {
            req.query.order = 'default';
        }
        let userItems = await findItems(req.params.uid, req.query.group, req.query.order);
        if (userItems == 'null') {
            return res.sendStatus(403);
        }

        return res.json(userItems);
    } else {
        return res.status(403).send();
    }
});

app.post('/api/v1/:uid/groups/:gid/items', async (req, res) => {
    if (validSession('', req.params.uid)) {
        let item = req.body;
        let err = await createItem(item);
        if (err) return res.json(err);

        return res.status(200).send();
    } else {
        return res.status(403).send();
    }
});

app.get('/api/v1/:uid/groups/:gid/items/:iid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        let item = await findItem(req.params.iid);
        if (item == null) {
            return res.status(500).send();
        }
        console.log(item);
        return res.json(item);
    } else {
        return res.status(403).send();
    }
});

app.delete('/api/v1/:uid/groups/:gid/items/:iid', async (req, res) => {
    if (validSession('', req.params.uid)) {
        let item = await findItem(req.params.iid);
        if (item == null) {
            return res.status(200).send();
        }
        await deleteItem(item.id);
        return res.status(200).send();

    } else {
        return res.status(403).send();
    }
});

async function findGroups(userId) {
    try {
        let groups = await knex.select('GroupId as groupId', 'Name as name').from('ToDoGroup').where({ UserId: userId });
        return groups
    } catch (err) {
        return null;
    }
}

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

async function createItem(data) {
    console.log(data, ' created data');
    let id = shortId.generate();
    try {
        await knex('ToDoItem').insert({
            ItemId: id,
            Description: data.description,
            Title: data.title,
            Date: data.date,
            GroupId: data.groupId
        });
        // await client.query(`INSERT INTO public."ToDoItem"(
        //     "ItemId", "Description", "Title", "Date", "UserId")
        //     VALUES ('${id}', '${data.description}', '${data.title}', '${data.date}', '${userId}');`);
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function createGroup(userId, data) {
    let id = shortId.generate();
    console.log(data);
    try {
        await knex('ToDoGroup').insert({
            GroupId: id,
            Name: data.name,
            UserId: userId
        });
    } catch (err) {
        return null;
    }
}

async function findItem(iid) {
    try {
        let item = await knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title', 'GroupId as groupId').from('ToDoItem').where({ ItemId: iid });
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

async function findItems(id, group, order) {
    try {
        let items;
        if (order == 'default') {
            items = await knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title').from('ToDoItem').where({ GroupId: group });
        } else {
            items = await knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title').from('ToDoItem').where({ GroupId: group }).orderBy(order, 'asc');
        }
        console.log(items);
        return items;
    } catch (err) {
        return null;
    }
}

function properOrderInput(input) {
    return (input != 'default' || input != 'Date' || input != 'Title');
}
