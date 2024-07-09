import sqlite from 'sqlite3';

// open the database
// const database_path = './' // './solution/server/'
const db = new sqlite.Database('memegame.sqlite', (err) => {
    if (err) throw err;
});

export default db;