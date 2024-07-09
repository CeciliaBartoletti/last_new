// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { createContext, useEffect, useState } from 'react'
import './App.css'
import BasicNavbar from './Components/Header';
import Button from 'react-bootstrap/Button';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { Container, Navbar, Row, Alert } from 'react-bootstrap';
import { HomePage } from './Pages/HomePage';
import { Game } from './Pages/Game';
import { API } from './API';
import { LoginPage } from './Pages/LoginPage';
import { LoginForm, LogoutButton } from './Components/LoginForm';
import NavHeader from './Components/NavHeader';
import { ProfilePage } from './Pages/ProfilePage';
// import { useNavigate } from 'react-router-dom';




// function App() {
//   return (
//     <BrowserRouter>
//       <Main/>
//     </BrowserRouter>
//   );
// }

export let Context = createContext({});

function App() {
  // const [count, setCount] = us
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // NEW
  const [message, setMessage] = useState(''); // NEW
  const [user, setUser] = useState(''); // NEW

  console.log('sam loggedIn', loggedIn);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setLoggedIn(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // NEW
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      console.log('logged user' + user.username); //OK
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setUser(user);
    } catch (err) {
      console.log('err');
      setMessage({ msg: err, type: 'danger' });
    }
  };

  // NEW
  const handleLogout = async () => {
    console.log('sam logout');
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };

  useEffect(() => {
    const fetchPhrases = async () => {
      setLoading(true);
      console.log('sam')
      try {
        const id_meme = "1"; // Replace with your actual meme ID
        console.log('sam 2')
        const fetchedPhrases = await API.getMemePhrases(id_meme);
        console.log('sam fetchedPhrases', fetchedPhrases);
        setPhrases(fetchedPhrases);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPhrases();
  }, []);

  console.log('sam phrases', phrases);

  // return (
  //   <BrowserRouter>
  //     <Navbar bg='primary' data-bs-theme='dark'>
  //       <Container fluid>
  //         {loggedIn ? 
  //           <LogoutButton logout={handleLogout} /> :
  //           <Link to='/login' className='btn btn-outline-light'>Login</Link>
  //         }
  //       </Container>
  //     </Navbar>
  //     {message && <div className={`alert alert-${message.type}`}>{message.msg}</div>}
  //     <Routes>
  //       <Route path="/" element={<HomePage />} />
  //       <Route path="/game" element={<Game />} />
  //       <Route path='/login' element={
  //         loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
  //       } />
  //       {/* Add more routes here as needed */}
  //     </Routes>
  //   </BrowserRouter>
  // );
  // }
  return (
    <Context.Provider value={{
      loggedIn: loggedIn,
      user: user,
    }}>
      <BrowserRouter>
        {/* <Navbar bg='primary' data-bs-theme='dark'>
        <Container fluid>
          <Link to='/' className='navbar-brand'>HeapOverrun</Link>
          <Button 
            variant='outline-light' 
            onClick={() => loggedIn ? handleLogout() : navigate('/login')}
          >
            {loggedIn ? 'Logout' : 'Login'}
          </Button>
        </Container>
      </Navbar> */}
        <BasicNavbar logout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<Game />} />
          <Route path='/login' element={
            loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
          } />
          <Route path='/profile' element={<ProfilePage/>} />
          {/* Add more routes here as needed */}
        </Routes>
      </BrowserRouter>
    </Context.Provider>

  )
}


export default App
