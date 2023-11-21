import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { editUserProfile, getUserData } from '../../services/users.services';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import { MIN_NAME_LENGTH } from '../../common/constants';
import ChangeProfilePicture from '../../components/ChangeProfilePicture/ChangeProfilePicture';
import './EditUserProfile.css'

export default function EditUserProfile({ loggedUser }) {
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getUserData(loggedUser.uid)
      .then((snapshot) => {
        const userKey = Object.keys(snapshot.val())[0];
        const userData = snapshot.val()[userKey];
        setCurrentUser(userData);
        setLoading(false);
        if (currentUser.isAdmin === true) {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        setMessage('Error fetching user data: ', error);
        setError(true);
      });
  }, [loggedUser.uid, currentUser.isAdmin]);

  const [form, setForm] = useState({
    name: '',
    surname: '',
    bio: null,
    phone: null,
  });

  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
    setIsUpdated(true);
  };

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name,
        surname: currentUser.surname,
        bio: (currentUser.bio ? currentUser.bio : null),
        phone: (currentUser.phone ? currentUser.phone : null),
      })
    }
  }, [currentUser]);

  const onEdit = (event) => {
    event.preventDefault();

    if (!form.name) {
      alert('Name is required');
      return;
    }

    editUserProfile(currentUser.handle, form)
      .then((result) => {
        if (result === 'Successful update') {
          setMessage('Profile details updated successfully.');
          setIsSuccessful(true);
        }
      })
      .catch((error) => {
        setMessage(`Error updating details: ${error.message}`);
        setError(true);
      });
    };

  return (
    <div className='flex items-center justify-center flex flex-col gap-8 px-40 py-12 max-xl:px-6'>
      <div className='flex flex-col gap-4'>
        {!loading && <ChangeProfilePicture handle={currentUser.handle} />}
        {!loading && (
          <div className='basic-details'>
            <div className='basic-details-intro'>
              <h2>Basic Details</h2>
              <p>Info about you across our forum.</p>
            </div>
            <div className='basic-details-input'>
              <div className='name-details'>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Name</span>
                  </label>
                  <input type="text" className="input input-bordered w-full max-w-3xl bg-light-gray" defaultValue={currentUser.name} onChange={updateForm('name')} />
                </div>
              </div>
              <div className='surname-details'>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Surname</span>
                  </label>
                  <input type="text" className="input input-bordered w-full max-w-3xl bg-light-gray" defaultValue={currentUser.surname} onChange={updateForm('surname')} />
                </div>
              </div>
              <div className='email-details'>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Email</span>
                  </label>
                  <input type="text" className="input input-bordered w-full max-w-3xl bg-light-gray" defaultValue={loggedUser.email} disabled />
                </div>
              </div>
              <div className='username-details'>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Username</span>
                  </label>
                  <input type="text" className="input input-bordered w-full max-w-3xl bg-light-gray" defaultValue={currentUser.handle} disabled />
                </div>
              </div>
              {isAdmin && <div className='phone-details'>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Phone Number</span>
                  </label>
                  <input type="tel" className="input input-bordered w-full max-w-3xl bg-light-gray" placeholder="+359 00 000 0000" defaultValue={currentUser.phone} onChange={updateForm('phone')}/>
                </div>
              </div>}
              <div className='user-description'>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Bio</span>
                  </label>
                  <textarea className="textarea textarea-bordered h-24 textarea-md w-full max-w-3xl bg-light-gray" placeholder="Bio" defaultValue={currentUser.bio} onChange={updateForm('bio')}></textarea>
                </div>
              </div>
              <div className='actions'>
                {isUpdated && form.name && form.name.length >= MIN_NAME_LENGTH && <button className="btn btn-tertiary" onClick={onEdit}>Save Updates</button>}
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{message}</span>
          </div>
        )}
        {isSuccessful && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{message}</span>
          </div>)
        }
        {!loading && <ChangePassword />}
      </div>
    </div>
  )
}

EditUserProfile.propTypes = {
  loggedUser: PropTypes.object,
};
