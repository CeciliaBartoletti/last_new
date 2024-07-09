const SERVER_URL = 'http://localhost:3001';
/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
    return await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
        body: JSON.stringify(credentials),
    })
    .then(response => response.json());
};
  
/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include'
    })
    .then(response => response.json());
};
  
  /**
   * This function destroy the current user's session (executing the log-out).
   */
  const logOut = async() => {
    return await fetch(SERVER_URL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
  }


  const getMemePhrases = async (id_meme) => {
    const response = await fetch(`${SERVER_URL}/memes/${id_meme}`);
    if (response.ok) {
      console.log('sam response');
      const phrasesJson = await response.json();
      return phrasesJson;
    } else {
      console.log('sam error');
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
  
  const getAllPhrases = async (id_meme) => {
    try {
      const correctPhrases = await getMemePhrases(id_meme);
      const notCorrectPhrases = await getNotMemePhrases(id_meme);
      const allPhrases = [...correctPhrases, ...notCorrectPhrases];
      return allPhrases;
    } catch (error) {
      console.error('Error fetching all phrases:', error);
      throw error;
    }
  }
  

const API = {logIn, getUserInfo, logOut, getMemePhrases, getNotMemePhrases};

export {API};