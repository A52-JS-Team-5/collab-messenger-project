import { useState, useEffect } from 'react'
import AppContext from './context/AuthContext';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { logoutUser } from './services/auth.services';
import { getUserData, getUsernameByUid } from './services/users.services';
import { auth } from './config/firebase-config';
import Home from './views/Home/Home';
import About from './views/About/About';
import NavBar from './components/NavBar/NavBar';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import UserProfile from './views/UserProfile/UserProfile';
import { ToastContainer } from 'react-toastify';
import EditUserProfile from './views/EditUserProfile/EditUserProfile';
import Footer from './components/Footer/Footer';
import PageNotFound from './views/PageNotFound/PageNotFound';
import Faqs from './views/FAQs/Faqs'

function App() {
  const [user, loading, error] = useAuthState(auth);

  const [appState, setAppState] = useState({
    user,
    userData: null,
  });

  // update the user in the app state to match the one retrieved from the hook above
  if (appState.user !== user) {
    setAppState({ user });
  }

  // logout the user
  const onLogout = () => {
    logoutUser()
      .then(() => {
        setAppState({
          user: null,
          userData: null,
        });
      })
      .catch(e => console.log(e.message))
  };

  useEffect(() => {
    if (user === null) return;

    getUserData(user.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }

        setAppState({
          ...appState,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        });
      })
      .catch(e => alert(e.message));
  }, [user, appState]);

  // Get the user handle
  const [loggedUserHandle, setLoggedUserHandle] = useState(null);

  useEffect(() => {
    if (user) {
      getUsernameByUid(user.uid)
        .then((handle) => {
          setLoggedUserHandle(handle);
        })
        .catch((error) => {
          console.error('Error fetching user handle: ', error);
        });
    }
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
        <NavBar user={user} onLogout={onLogout} loggedUserHandle={loggedUserHandle}/>
        {/* Conditional rendering based on user, loading, and error */}
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {!loading && !error && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faqs />} />
            <Route path="/users/:userHandle" element={<UserProfile />} />
            <Route path="/users/:userHandle/edit" element={<EditUserProfile loggedUser={user}/>} />
            <Route path='*' element={<PageNotFound />}/>
          </Routes>
        )}
        <Footer />
      </AppContext.Provider >
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
