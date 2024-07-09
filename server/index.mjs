/*** Importing modules ***/

"use strict"
import MemeDao from "./memedao.mjs"
import db from './db.mjs'
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import { check, validationResult } from 'express-validator'; // validation middleware
import passport from 'passport';                              // authentication middleware
import LocalStrategy from 'passport-local';   
// import UserDao from './user-dao.mjs';
import session from 'express-session';
import UserDao from './user-dao.mjs'

const memeDao = new MemeDao();
const userDao = new UserDao();

/*** init express and set up the middlewares ***/
const app = express();
const port = 3001;
// const db = new Database("memegame.db");
app.use(express.json());
app.use(morgan('dev'));



/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
                // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials() (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUserByCredentials(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));


// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name
  return callback(null, user); // this will be available in req.user

  // In this method, if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
});


/** Creating the session */



app.use(session({
  secret: "Secret info cecilia",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('authenticated')
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}



/*** Users APIs ***/

// POST /api/sessions
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});
// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});



// const publicPath = path.resolve('./public');
// app.use(express.static(publicPath));

// // Esempio di endpoint per restituire un'immagine statica
// app.get('/images/:id', (req, res) => {
//   const imageName = req.params.id; // Usa req.params.id per ottenere il nome dell'immagine
//   // Non è necessario verificare l'esistenza del file manualmente

//   // Invia l'immagine come risposta
//   res.sendFile(path.join(publicPath, imageName));
// });


// Endpoint per ottenere i giochi e i relativi round per un utente
app.get('/api/user/:id/games', async (req, res) => {
  const userId = req.params.id; // Supponiamo che l'ID dell'utente loggato sia disponibile in req.user

  try {
    const gamesWithRounds = await memeDao.getGames(userId);
    res.json(gamesWithRounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint per salvare un nuovo gioco e i relativi round
app.post('/api/games/save', async (req, res) => {
  console.log('sam req!!!', req?.body);
  const { userId, score, rounds } = req.body;
  try {
    const result = await memeDao.saveGame(userId, score, rounds);
    if (result.success) {
      res.status(201).json({ message: "Game saved successfully", id_game: result.id_game });
    } else {
      res.status(400).json({ error: "Failed to save game" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get('/memes/:id', async (req, res) => {
  const id_meme = req.params.id
  try {
    const correctPhrases = await memeDao.getMemePhrases(id_meme); // Ottiene le frasi corrette
    const notCorrectPhrases = await memeDao.getNotMemePhrases(id_meme); // Ottiene le frasi non corrette
    // Unisci le due liste di frasi
    const allPhrases = [...correctPhrases, ...notCorrectPhrases];
    res.json({ phrases: allPhrases });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.get('/api/memes/:id_meme', async (req, res) => {
//   const id_meme = req.params.id;

//   try {
//     const correctPhrases = await memeDao.getMemePhrases(id_meme);
//     res.json({ phrases: correctPhrases });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });



app.get('/users/:id', (req, res) => { // TODO: validation of req.params.id 
  userDao.getUserById(req.params.id).then((user) => res.json(user));
});


// app.get('/memes/:id', async (req, res) => {
//   const id_meme = req.params.id;

//   try {
//       const notMemePhrases = await memeDao.getNotMemePhrases(id_meme);
//       res.json({ phrases: notMemePhrases });
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });

app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userDao.getUserById(userId);
    if (user.error) {
      res.status(404).json(user); // Ritorna un errore se l'utente non è stato trovato
    } else {
      res.json(user); // Ritorna l'utente trovato
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users/:id', (req, res) => { // TODO: validation of req.params.id 
  userDao.getUserById(req.params.id).then((user) => res.json(user));
});



// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));