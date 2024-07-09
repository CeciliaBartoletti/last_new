import { Game, Round } from "./mememodels.mjs";

const SERVER_URL = 'http://localhost:3001';

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
    return await fetch(SERVER_URL + '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
        body: JSON.stringify(credentials),
    }).then(response => response.json());
};
  

//  * This function is used to verify if the user is still logged-in.
//  * It returns a JSON object with the user info.
//  *
//  * 
const getUserInfo = async () => {
    return await fetch(SERVER_URL + 'api/sessions/current', {
        credentials: 'include'
    }).then(response => response.json());
};
  
  
  //  * This function destroy the current user's session (executing the log-out).
  //  */
  const logOut = async() => {
    return await fetch(SERVER_URL + 'api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
  }


  const getMemePhrases = async (id_meme) => {
    const response = await fetch(`${SERVER_URL}/memes/${id_meme}`);
    if (response.ok) {
      const phrasesJson = await response.json();
      return phrasesJson;
    } else {
      throw new Error('Internal server error');
    }
  }
  
  const getNotMemePhrases = async (id_meme) => {
    const response = await fetch(`${SERVER_URL}/api/memes/${id_meme}/not-phrases`);
    if (response.ok) {
      const phrasesJson = await response.json();
      return phrasesJson;
    } else {
      throw new Error('Internal server error');
    }
  }

 const getGames = async (userId) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/user/${userId}/games`);
      if (response.ok) {
        const gamesData = await response.json();
        
        // Mappa i giochi e i relativi round
        const games = gamesData.map(gameData => {
          console.log('sam gamedata', gameData);
          // Crea un oggetto Game con le informazioni di base
          const game = new Game(gameData.id_game, gameData.id_user, gameData.score, /**gameData.timestamp**/);
          console.log('sam game', game);
          // Aggiungi i round associati al gioco
          if (gameData.rounds) {
            game.rounds = gameData.rounds.map(roundData => {
              console.log('sam roundData', roundData);
              const round = new Round(roundData.id_round, game?.id_game, roundData.id_meme, roundData.text, roundData.score);
              return round;
            });
          }
          return game;
        });
        
        return games;
      } else {
        throw new Error('Failed to retrieve games');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
// Funzione per salvare una nuova partita con i suoi rounds
const saveGame = async (userId, score, rounds) => {
    try {
      // Costruisci l'oggetto game da inviare al server
      const gameData = {
        id_user: userId,
        score: score,
        // timestamp: new Date().toISOString(), // Timestamp corrente
        rounds: rounds // Array di round da salvare
      };

      console.log('sam game data', gameData);
  
      const response = await fetch(`${SERVER_URL}/api/games/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_user: userId,
          score: score,
          // timestamp: new Date().toISOString(), // Timestamp corrente
          rounds: rounds,// Array di round da salvare
        })
      });
  
      if (response.ok) {
        const responseData = await response.json();
        return responseData; // Dovrebbe contenere un oggetto con success: true e l'id del gioco salvato
      } else {
        throw new Error('Failed to save game');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      throw error;
    }
  };
  
  

const API = {logIn, getUserInfo, logOut, getMemePhrases, getNotMemePhrases,saveGame, getGames};

export {API};

