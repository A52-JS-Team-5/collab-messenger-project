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
import Insights from './views/Insights/Insights';
// import Chats from './views/Chats/Chats';
import ChatsLayout from './views/ChatsLayout/ChatsLayout'
import SideMenu from './components/SideMenu/SideMenu';
import AppNav from './components/AppNav/AppNav';
import Teams from './views/Teams/Teams';
import SingleTeamView from './views/SingleTeamView/SingleTeamView';
import SearchResults from './views/SearchResults/SearchResults';
import ChatDetails from './components/ChatDetails/ChatDetails';

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
      .catch(e => {
        alert(e.message);
      })
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
        {window.location.pathname.includes('/app') ? (
          <div className='flex flex-row gap-4 max-h-[96vh] overflow-hidden'>
            {/* If we're in the website part, we use the flex flex-col className, else - flex flex-row */}
            {!loading && <SideMenu />}
            {/* Conditional rendering based on user, loading, and error */}
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {!loading && !error && (
              <div className='flex flex-col flex-1 min-h-[96vh]'>
                {<AppNav onLogout={onLogout} user={user} loggedUserHandle={loggedUserHandle}/>}
                <Routes>
                  <Route path="/app/users/:userHandle" element={<UserProfile />} />
                  <Route path="/app/users/:userHandle/edit" element={<EditUserProfile loggedUser={user} />} />
                  <Route path='*' element={<PageNotFound />} />
                  <Route path='/app/search-results' element={<SearchResults />} />
                  <Route path="/app/insights" element={<Insights />} />
                  <Route path='/app/chats' element={<ChatsLayout /> }>              
                    <Route path=':chatId' element={<ChatDetails /> }/>
                  </Route>
                  <Route path="/app/teams" element={<Teams />} />
                  <Route path="/app/teams/:teamId" element={<SingleTeamView />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col'>
            {/* If we're in the website part, we use the flex flex-col className, else - flex flex-row */}
            {!loading && <NavBar user={user} onLogout={onLogout} loggedUserHandle={loggedUserHandle} />}
            {/* Conditional rendering based on user, loading, and error */}
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {!loading && !error && (
              <div className='flex flex-col flex-1 min-h-[96vh]'>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path='*' element={<PageNotFound />} />
                  <Route path="/faq" element={<Faqs />} />
                  <Route path="/app/insights" element={<Insights />} />
                </Routes>
              </div>
            )}
            <Footer />
          </div>
        )}
      </AppContext.Provider >
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
