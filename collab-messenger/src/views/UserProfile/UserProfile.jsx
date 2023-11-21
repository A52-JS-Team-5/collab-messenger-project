import { useEffect, useState } from 'react';
import { getUserByHandle } from '../../services/users.services';
import UserDetails from '../../components/UserDetails/UserDetails';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userHandle } = useParams();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserByHandle(userHandle)
      .then((userData) => {
        setUserDetails(userData.val());
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data: ', error);
        setError(error);
        setLoading(false);
      });
  }, [userHandle]);

  const [activeTab, setActiveTab] = useState(0); // 0 for Posts, 1 for Comments, 2 for Liked Posts

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className='flex px-40 max-xl:px-6 py-12 min-h-[90vh]'>
      {!loading && userDetails &&
        <div className='flex flex flex-row max-2xl:flex-col gap-10 w-full'>
          <div className='basis-1/4 max-xl:basis-4/4'>
            <UserDetails user={userDetails} />
          </div>
          <div className='user-content basis-3/4 flex flex-col gap-4 w-full'>
            <div className='profile-actions'>
              <div className="tabs max-sm:block">
                <a className={`tab tab-bordered  max-sm:block ${activeTab === 0 && 'tab-active'}`} onClick={() => handleTabClick(0)}>Posts by the User</a>
                <a className={`tab tab-bordered  max-sm:block ${activeTab === 1 && 'tab-active'}`} onClick={() => handleTabClick(1)}>Comments by the User</a>
                <a className={`tab tab-bordered  max-sm:block ${activeTab === 2 && 'tab-active'}`} onClick={() => handleTabClick(2)}>Liked Posts</a>
              </div>
            </div>
            <div className='flex profile-actions-content w-full'>
              {activeTab === 0 }
              {activeTab === 1 }
              {activeTab === 2 }
            </div>
          </div>
        </div>
      }
      {!loading && error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      {!userDetails && !loading && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>User Not Found.</span>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
