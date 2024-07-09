"use strict"

import {Game, Round} from './mememodels.mjs'
import sqlite from 'sqlite3';
import crypto from 'crypto';
import db from "./db.mjs";


const dbAllAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else     resolve(rows);
    });
  });
  
  /**
   * Wrapper around db.run
   */
  const dbRunAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, err => {
      if (err) reject(err);
      else     resolve();
    });
  });
  
  /**
   * Wrapper around db.get
   */
  const dbGetAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else     resolve(row);
    });
  });


export default function MemeDao() {
    // this.db = new sqlite.Database(dbname, err => {
    //   if (err) throw err;
    // }); 
this.getMemePhrases = async (id_meme) => {
  try {
    const phrases = await dbAllAsync(
        db,
        "SELECT id_phrase, text FROM phrases where id_meme = ?"  ,
        [id_meme]
    );
    return phrases.map(c => c.text);
} catch (err) {
    throw new Error("Error retrieving phrases: " + err.message);
}
};

this.getNotMemePhrases = async (id_meme) => {
  try {
      const phrases = await dbAllAsync(
          db,
          "SELECT id_phrase, text FROM phrases WHERE id_meme != ? OR id_meme IS NULL ORDER BY RANDOM() LIMIT 5",
          [id_meme]
      );
      return phrases.map(c => c.text);
  } catch (err) {
      throw new Error("Error retrieving not meme phrases: " + err.message);
  }
};



this.getRounds = (id_game) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM rounds WHERE id_game = ?';
      db.all(sql, [id_game], (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve({ error: "No rounds available, check the inserted id." });
        } else {
          const rounds = rows.map(row => new Round(row.id_round, row.id_game, row.id_meme, row.text, row.score));
          resolve(rounds);
        }
      });
    });
  }


 // Funzione per ottenere i giochi e i relativi round per un dato id_user
this.getGamesAndRounds = async (id_user) => {
    try {
      // Query per ottenere i giochi del giocatore
      const games = await dbAllAsync(
        "SELECT * FROM games WHERE id_user = ?",
        [id_user]
      );
  
      if (games.length === 0) {
        return { error: "No games available for the given user ID." };
      }
  
      // Array per contenere i giochi con i relativi round
      const gamesWithRounds = [];
  
      for (const game of games) {
        // Utilizzare la funzione predefinita per ottenere i round del gioco corrente
        const rounds = await getRounds(game.id_game);
  
        if (rounds.error) {
          gamesWithRounds.push(new Game(game.id_game, game.id_user, game.timestamp, []));
        } else {
          // Creare l'oggetto Game con i relativi round
          const gameWithRounds = new Game(game.id_game, game.id_user, game.timestamp, rounds);
          // Aggiungere l'oggetto Game all'array
          gamesWithRounds.push(gameWithRounds);
        }
      }
  
      return gamesWithRounds;
  
    } catch (err) {
      console.error(err);
      return { error: "An error occurred while retrieving the data." };
    }
  };


this.saveGame = async (game, rounds) => {
    // Inizio transazione
    await dbRunAsync("BEGIN TRANSACTION");
  
    try {
      // Inserisci il gioco nella tabella games
      const resultGame = await dbRunAsync(
        db,
        "INSERT INTO games (id_game, id_user, timestamp, score) VALUES (?, ?, ?, ?)",
        [game.id_game, game.id_user, game.timestamp.toISOString(), game.score]
      );
  
      // Ottieni l'ID del gioco appena inserito
      const id_game = resultGame.lastID;
  
      // Inserisci i round nella tabella rounds
      for (const round of rounds) {
        await dbRunAsync(
          db,
          "INSERT INTO rounds (id_game, id_meme, text, score) VALUES (?, ?, ?, ?)",
          [id_game, round.id_meme, round.text, round.score]
        );
      }
  
      // Conferma la transazione
      await dbRunAsync("COMMIT");
  
      return { success: true, id_game: id_game };
  
    } catch (err) {
      // Se c'è un errore, annulla la transazione
      await dbRunAsync("ROLLBACK");
      console.error(err);
      return { error: "An error occurred while saving the game." };
    }
  };
  
}

// module.exports = Database;

// // add a new question
// export const addQuestion = (question) => {
//   return new Promise((resolve, reject) => {
//     let sql = 'SELECT id from user WHERE email = ?';
//     db.get(sql, [question.email], (err, row) => {
//       if (err)
//         reject(err);
//       else if (row === undefined)
//         resolve({error: "Author not available, check the inserted email."});
//       else {
//         sql = 'INSERT INTO question(text, authorId, date) VALUES(?,?,DATE(?))';
//         db.run(sql, [question.text, row.id, question.date.toISOString()], function (err) {
//           if (err)
//             reject(err);
//           else
//             resolve(this.lastID);
//         });
//       }
//     });
//   });
// }

/** ANSWERS **/

// get all the answer of a given question
// export const listAnswersOf = (questionId) => {
//   return new Promise((resolve, reject) => {
//     const sql = 'SELECT answer.*, user.email FROM answer JOIN user ON answer.authorId=user.id WHERE answer.questionId = ?';
//     db.all(sql, [questionId], (err, rows) => {
//       if (err)
//         reject(err)
//       else {
//         const answers = rows.map((ans) => new Answer(ans.id, ans.text, ans.email, ans.date, ans.score));
//         resolve(answers);
//       }
//     });
//   });
// }

// // add a new answer
// export const addAnswer = (answer, questionId) => {
//   return new Promise((resolve, reject) => {
//     let sql = 'SELECT id from user WHERE email = ?';
//     db.get(sql, [answer.email], (err, row) => {
//       if (err)
//         reject(err);
//       else if (row === undefined)
//         resolve({error: "Author not available, check the inserted email."});
//       else {
//         sql = "INSERT INTO answer(text, authorId, date, score, questionId) VALUES (?, ?, DATE(?), ?, ?)";
//         db.run(sql, [answer.text, row.id, answer.date, answer.score, questionId], function (err) {
//           if (err)
//             reject(err);
//           else
//             resolve(this.lastID);
//         });
//       }
//     });
//   });
// }

// // update an existing answer
// export const updateAnswer = (answer) => {
//   return new Promise((resolve, reject) => {
//     let sql = 'SELECT id from user WHERE email = ?';
//     db.get(sql, [answer.email], (err, row) => {
//       if (err)
//         reject(err);
//       else if (row === undefined)
//         resolve({error: "Author not available, check the inserted email."});
//       else {
//         sql = "UPDATE answer SET text = ?, authorId = ?, date = DATE(?), score = ? WHERE id = ?"
//         db.run(sql, [answer.text, row.id, answer.date, answer.score, answer.id], function (err) {
//           if (err)
//             reject(err);
//           else
//             resolve(this.lastID);
//         });
//       }
//     });
//   });
// }

// // vote for an answer
// export const voteAnswer = (answerId, vote) => {
//   return new Promise ((resolve, reject) => {
//     const delta = vote === 'upvote' ? 1: -1;
//     const sql = 'UPDATE answer SET score = score + ? WHERE id = ?';
//     db.run(sql, [delta, answerId], function(err) {
//       if(err) reject(err);
//       resolve(this.changes);
//     });
//   });
// }