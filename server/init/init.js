const PostgresClient = require('pg').Client;
const client = new PostgresClient({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'todo'
});
client.connect(err => { if (err) console.log('Could not connect', err); });

clearDB();

async function clearDB() {
    await client.query(`delete from public."User" where "User"."UserId" like '%'`);
    await client.query(`delete from public."ToDoItem" where "ToDoItem"."ItemId" like '%'`);
    await client.query(`delete from public."Session" where "Session"."SessionId" like '%'`);

    console.log('Database cleared');
    process.exit();
}