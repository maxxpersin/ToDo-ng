const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'todo'
    }
});

clearDB();

async function clearDB() {
    await knex.schema.dropTableIfExists('User');
    await knex.schema.createTable('User', table => {
        table.string('UserId').primary();
        table.string('FirstName');
        table.string('LastName');
        table.string('Email');
        table.string('Password');    
    });
    await knex.schema.dropTableIfExists('ToDoGroup');
    await knex.schema.createTable('ToDoGroup', table => {
        table.string('GroupId').primary();
        table.string('UserId');
        table.string('Name');
    });
    await knex.schema.dropTableIfExists('ToDoItem');
    await knex.schema.createTable('ToDoItem', table => {
        table.string('ItemId').primary();
        table.date('Date');
        table.string('GroupId');
        table.string('Title');
        table.string('Description');
    });
    await knex.schema.dropTableIfExists('Session');
    await knex.schema.createTable('Session', table => {
        table.string('SessionId').primary();
        table.string('UserId');
        table.string('Expiration');
    });
    
    console.log('Database cleared');
    process.exit();
}