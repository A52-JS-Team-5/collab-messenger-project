import { useState, useEffect } from 'react'
import AppContext from './context/AuthContext';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { logoutUser } from './services/auth.services';
import { changeStatus } from './services/users.services';
import { auth, db } from './config/firebase-config';
import Home from './views/Home/Home';
import About from './views/About/About';
import NavBar from './components/NavBar/NavBar';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import EditUserProfile from './views/EditUserProfile/EditUserProfile';
import Footer from './components/Footer/Footer';
import PageNotFound from './views/PageNotFound/PageNotFound';
import Faqs from './views/FAQs/Faqs'
import Insights from './views/Insights/Insights';
import ChatsLayout from './views/ChatsLayout/ChatsLayout'
import SideMenu from './components/SideMenu/SideMenu';
import AppNav from './components/AppNav/AppNav';
import Teams from './views/Teams/Teams';
import SingleTeamView from './views/SingleTeamView/SingleTeamView';
import SearchResults from './views/SearchResults/SearchResults';
import ChatDetails from './components/ChatDetails/ChatDetails';
import MobileSideMenu from './components/MobileSideMenu/MobileSideMenu';
import ChannelDetails from './components/ChannelDetails/ChannelDetails'
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import PageNotAccessible from './views/PageNotAccessible/PageNotAccessible';
import { toast } from 'react-toastify';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

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
    changeStatus(appState.userData?.handle, "Offline");
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

    const userQuery = query(ref(db, 'users'), orderByChild('uid'), equalTo(user.uid));
    const userListener = onValue(userQuery, (snapshot) => {
      if (!snapshot.exists()) {
        toast('Something went wrong!');
        return;
      }

      setAppState(prevState => ({
        ...prevState,
        userData: snapshot.val()[Object.keys(snapshot.val())[0]],
      }));
    })

    return () => userListener();

  }, [user]);

  return (
    <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
      {location.pathname.includes('/app') ? (
        user !== null ? (<div className='flex flex-row gap-4 max-h-[96vh] overflow-hidden'>
          {/* If we're in the website part, we use the flex flex-col className, else - flex flex-row */}
          {!loading && <SideMenu />}
          {/* Conditional rendering based on user, loading, and error */}
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {!loading && !error && (
            <div className='flex flex-col flex-1 min-h-[96vh]'>
              {<AppNav onLogout={onLogout} />}
              <Routes>
                <Route path="/app/users/:userHandle/edit" element={<EditUserProfile />} />
                <Route path='*' element={<PageNotFound />} />
                <Route path='/app/search-results' element={<SearchResults />} />
                <Route path="/app" element={<Insights />} />
                <Route path='/app/chats' element={<ChatsLayout />} >
                  <Route path=':chatId' element={<ChatDetails />} />
                </Route>
                <Route path="/app/teams" element={<Teams />} />
                <Route path="/app/teams/:teamId" element={<SingleTeamView />} >
                  <Route path=':channelId' element={<ChannelDetails />} />
                </Route>
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          )}
          {!loading && !error && <MobileSideMenu />}
        </div>) : (!loading && <PageNotAccessible />)
      ) : (
        <div className='flex flex-col'>
          {/* If we're in the website part, we use the flex flex-col className, else - flex flex-row */}
          {!loading && <NavBar onLogout={onLogout} />}
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
                <Route path="/app" element={<Insights />} />
              </Routes>
            </div>
          )}
          {!loading && !error && <Footer />}
        </div>
      )}
    </AppContext.Provider >
  )
}

export default App
