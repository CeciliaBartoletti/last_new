"use strict"
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
    
this.getMemePhrases = async (id_meme) => {
  try {
    const phrases = await dbAllAsync(
        db,
        "SELECT id_phrase, text FROM phrases where id_meme = ?"  ,
        [id_meme]
    );
    return phrases.map(c => ({
      text: c.text,
      correct: true}))
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
      return phrases.map(c => ({
        text:c.text,
        correct : false}
      )
      );
  } catch (err) {
      throw new Error("Error retrieving not meme phrases: " + err.message);
  }
};

this.getGames = async (id_user) => {
  try {
    // Esegui la query per ottenere i giochi dell'utente specificato con i relativi round
    const games = await dbAllAsync(
      db,
      "SELECT g.id_game, g.timestamp, g.score, r.id_round, r.text, r.id_meme, r.score AS round_score " +
      "FROM games g " +
      "LEFT JOIN rounds r ON g.id_game = r.id_game " +
      "WHERE g.id_user = ?",
      [id_user]
    );

    const groupedGames = {};

    games.forEach(row => {
      if (!groupedGames[row.id_game]) {
        groupedGames[row.id_game] = {
          id_game: row.id_game,
          timestamp: new Date(row.timestamp),
          score: row.score,
          rounds: []
        };
      }

      if (row.id_round) {
        groupedGames[row.id_game].rounds.push({
          id_round: row.id_round,
          text: row.text,
          id_meme:row.id_meme,
          round_score: row.score
        });
      }
    });

    // Converte l'oggetto raggruppato in un array di giochi con i relativi round
    const gamesWithRounds = Object.values(groupedGames);

    return gamesWithRounds; // Restituisci tutti i giochi con i relativi round
  } catch (err) {
    console.error("Error fetching games and rounds:", err);
    throw new Error("Failed to fetch games and rounds");
  }
};


this.saveGame = async (id_user, score, rounds) => {
  console.log('samuello id_user, score, rounds', id_user, score, rounds);
  // Inizio transazione
   

  try {
    // Inserisci il gioco nella tabella games
    const maxIdGameRow = await dbGetAsync(db, "SELECT MAX(id_game) AS max_id_game FROM games");
    const maxIdGame = maxIdGameRow ? maxIdGameRow.max_id_game : 0;
    
    // Insert the new game with id_game incremented by 1
    console.log()
    const newIdGame = maxIdGame + 1;
    const resultGame = await dbRunAsync(
      db,
      "INSERT INTO games (id_game, id_user, score) VALUES (?, ?, ?)",
      [newIdGame, id_user, score]
    );
    console.log('sam PROVA resultGame', newIdGame, id_user, score);

    // Inserisci i round nella tabella rounds
    console.log('sam rounds', rounds);
    for (const round of rounds) {
      await dbRunAsync(
        db,
        "INSERT INTO rounds (id_game, id_round, id_meme, text, score) VALUES (?, ?, ?, ?, ?)",
        // [newIdGame, round.id_round, round.id_meme, round.text, round.score]
        [newIdGame, 1, "......", 5, 111]

      );
      console.log('sam PROVA round', newIdGame, round.id_round, round.id_meme, round.text, round.score);
    }
// this.saveGame = async (game, rounds) => {
//   // Inizio transazione
//   await dbRunAsync("BEGIN TRANSACTION");

//   try {
//     // Inserisci il gioco nella tabella games
//     const resultGame = await dbRunAsync(
//       db,
//       "INSERT INTO games (id_game, id_user, timestamp, score) VALUES (?, ?, ?, ?)",
//       [game.id_game, game.id_user, game.timestamp.toISOString(), game.score]
//     );

//     // Ottieni l'ID del gioco appena inserito
//     const id_game = resultGame.lastID;

//     // Inserisci i round nella tabella rounds
//     for (const round of rounds) {
//       await dbRunAsync(
//         db,
//         "INSERT INTO rounds (id_game, id_round, id_meme, text, score) VALUES (?, ?, ?, ?, ?)",
//         [id_game, round.id_round, round.id_meme, round.text, round.score]
//       );
//     }
    // Conferma la transazione

    return { success: true, /**id_game: id_game**/ };

  } catch (err) {
    // Se c'è un errore, annulla la transazione
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