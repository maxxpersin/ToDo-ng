const express = require('express');
const app = express();
const shortId = require('shortid');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'todo'
    }
});

const port = 3000;

app.listen(port, () => console.log('ToDo App listening on port 3000'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
            Expiration: (Date.now() + (1000 * 60 * 10)).toString(),
            UserId: cleanUser.id
        });

        res.cookie('session-id', cleanUser.sessionId, { httpOnly: true });

        return res.json(cleanUser);
    } else {
        return res.status(406).json('Invalid password');
    }
});

app.post('/api/v1/logout', async (req, res) => {
    let user = req.body;
    await knex('Session')
        .where('SessionId', 'like', `${req.body.sessionId}`, 'and', 'UserId', 'like', `${req.body.id}`)
        .del()
        .catch(err => console.log(err));
    return res.json('OK');
});

app.get('/api/v1/groups/:uid', async (req, res) => {
    if (await validSession(req.params.uid, req.cookies['session-id'])) {
        let groups;
        if (req.query.filter == 'true') {
            groups = await findGroupsFilter(req.params.uid);
        } else {
            groups = await findGroups(req.params.uid);
        }

        if (!groups) {
            return res.status(500).send();
        }
        return res.json(groups);
    } else {
        return res.status(403).send();
    }
});

app.post('/api/v1/groups/:uid', async (req, res) => {
    if (await validSession(req.params.uid, req.cookies['session-id'])) {
        await createGroup(req.params.uid, req.body);
        return res.status(200).send();
    } else {
        return res.status(403).send();
    }

});

app.get('/api/v1/items/:uid', async (req, res) => {
    if (await validSession(req.params.uid, req.cookies['session-id'])) {
        if (!req.query.order || !properOrderInput(req.query.order)) {
            req.query.order = 'default';
        }
        let userItems;
        if (req.query['hide-expired'] == 'true') {
            userItems = await findItemsExceptExpired(req.query.group, req.query.order);
            userItems = userItems.rows;
        } else {
            userItems = await findItems(req.query.group, req.query.order);
        }
        if (userItems == null) {
            return res.sendStatus(403);
        }

        return res.json(userItems);
    } else {
        return res.status(403).send();
    }
});

app.post('/api/v1/:uid/groups/:gid/items', async (req, res) => {
    if (await validSession(req.params.uid, req.cookies['session-id'])) {
        let item = req.body;
        let err = await createItem(item);
        if (err) return res.json(err);

        return res.status(200).send();
    } else {
        return res.status(403).send();
    }
});

app.get('/api/v1/:uid/groups/:gid/items/:iid', async (req, res) => {
    if (await validSession(req.params.uid, req.cookies['session-id'])) {
        let item = await findItem(req.params.iid);
        if (item == null) {
            return res.status(500).send();
        }
        return res.json(item);
    } else {
        return res.status(403).send();
    }
});

app.put('/api/v1/:uid/groups/:gid/items/:iid', async (req, res) => {
    if (await validSession(req.params.uid, req.cookies['session-id'])) {
        let err = await updateItem(req.body);

        if (err) {
            return res.status(500).send();
        }

        return res.status(200).send();
    } else {
        return res.status(403).send();
    }
});

app.delete('/api/v1/:uid/groups/:gid/items/:iid', async (req, res) => {
    if (await validSession(req.params.uid, req.cookies['session-id'])) {
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

app.delete('/api/v1/:uid/groups/:gid', async (req, res) => {
    if (await validSession(req.params.uid, req.cookies['session-id'])) {
        await deleteGroup(req.params.gid);

        return res.status(200).send();
    } else {
        return res.status(403).send();
    }
});

async function findGroups(userId) {
    try {
        let groups = await knex.select('GroupId as groupId', 'Name as name')
            .from('ToDoGroup')
            .where({ UserId: userId });
        return groups
    } catch (err) {
        return null;
    }
}

async function deleteItem(iid) {
    try {
        await knex('ToDoItem')
                .where({ ItemId: iid })
                .del();
    } catch (err) {

    }
}

async function updateSession(session) {
    try {
        await knex('Session')
                .where({ SessionId: session.sessionId })
                .update({ Expiration: (Date.now() + (1000 * 60 * 10)).toString() });
    } catch (err) {
        console.log(err);
    }
}

async function validSession(userId, cookie) {
    try {
        let session = await knex.select('SessionId as sessionId', 'Expiration as expiration')
                                .from('Session')
                                .where({ UserId: userId });

        if (!session[0] || session[0].sessionId != cookie) { //No cookie match
            return false;
        }

        let pass = Date(session[0].expiration) < Date.now() ? false : true;
        if (pass) {
            await updateSession(session[0]);
        }
        return pass;
    } catch (err) {
        console.log(err);
        return false;
    }
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
    } catch (err) {
        return err;
    }
}

async function createItem(data) {
    let id = shortId.generate();
    try {
        await knex('ToDoItem').insert({
            ItemId: id,
            Description: data.description,
            Title: data.title,
            Date: new Date(data.date),
            GroupId: data.groupId
        });
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function createGroup(userId, data) {
    let id = shortId.generate();
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
        let item = await knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title', 'GroupId as groupId')
                                .from('ToDoItem')
                                .where({ ItemId: iid });
        return item[0];
    } catch (err) {
        return err;
    }
}

async function updateItem(itemToUpdate) {
    try {
        await knex('ToDoItem')
            .where({ ItemId: itemToUpdate.id })
            .update({
                Title: itemToUpdate.title,
                Description: itemToUpdate.description,
                Date: new Date(itemToUpdate.date)
            });
    } catch (err) {
        return err;
    }
}

async function deleteGroup(gid) {
    try {
        await knex('ToDoGroup')
            .join('ToDoItem', 'ToDoGroup.GroupId', '=', 'ToDoItem.GroupId')
            .where('ToDoGroup.GroupId', '=', `${gid}`)
            .del();
    } catch (err) {
        console.log(err);
    }
}

async function findUserByEmail(email) {
    try {
        let user = await knex.select()
                                .from('User')
                                .where({ Email: email });
        return user[0];
    } catch (err) {
        return null;
    }
}

// ORDER BY QUERY
async function findItems(group, order) {
    try {
        let items;
        if (order == 'default') {
            items = await knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title')
                                .from('ToDoItem')
                                .where('GroupId', '=', `${group}`);
        } else {
            items = await knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title')
                                .from('ToDoItem')
                                .where('GroupId', '=', `${group}`)
                                .orderBy(order, 'asc');
        }
        return items;
    } catch (err) {
        return null;
    }
}

function properOrderInput(input) {
    return (input != 'default' || input != 'Date' || input != 'Title');
}


// HAVING QUERY
async function findGroupsFilter(userId) {
    try {
        let groups = await knex.select('ToDoGroup.GroupId as groupId', 'ToDoGroup.Name as name')
            .from('ToDoGroup')
            .join('ToDoItem', 'ToDoGroup.GroupId', '=', 'ToDoItem.GroupId')
            .groupBy('ToDoGroup.GroupId')
            .orderBy('ToDoGroup.Name', 'asc')
            .having(knex.raw('count("ToDoGroup"."GroupId") > 0'));

        return groups;
    } catch (err) {
        return null;
    }
}

// SET OPERATOR QUERY [? EXCEPT ?]
async function findItemsExceptExpired(groupId, order) {
    try {
        if (order == 'default') {
            return await knex.raw(
                `? EXCEPT ? `,
                [knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title', 'GroupId as groupId')
                    .from('ToDoItem')
                    .where('GroupId', '=', `${groupId}`),
                knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title', 'GroupId as groupId')
                    .from('ToDoItem')
                    .where('ToDoItem.Date', '<', new Date().toISOString())]);
        } else {
            return await knex.raw(
                `? EXCEPT ? `,
                [knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title', 'GroupId as groupId')
                    .from('ToDoItem')
                    .where('GroupId', '=', `${groupId}`),
                knex.select('Date as date', 'ItemId as id', 'Description as description', 'Title as title', 'GroupId as groupId')
                    .from('ToDoItem')
                    .where('ToDoItem.Date', '<', new Date().toISOString())
                    .orderBy(order, 'asc')]);

        }
    } catch (err) {
        console.log(err);
        return null;
    }
}