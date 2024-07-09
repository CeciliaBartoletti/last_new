// /* Data Access Object (DAO) module for accessing users data */

/**  NEW **/
'use strict';
import  db  from './db.mjs';
import crypto from 'crypto';

export default function UserDao() {
    
    // This function retrieves one user by id
    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id_user=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'User not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };

    this.getUserByCredentials = (email, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email=?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = { id: row.id_user, username: row.email, name: row.name};

                    // const user = { id: row.id_user, username: row.email, name: row.name, password:row.hash };
                    // resolve(user);
                    
 
                    // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { // WARN: it is 64 and not 32 (as in the week example) in the DB
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

}