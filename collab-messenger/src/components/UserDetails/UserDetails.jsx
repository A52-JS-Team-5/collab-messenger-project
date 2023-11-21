import PropTypes from 'prop-types';
import './UserDetails.css';

export default function UserDetails({ user }) {
  const timestamp = new Date(user.createdOn).toLocaleDateString();
  const defaultPhotoURL = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';

  return (
    <div className='user-card md:max-xl:flex-row'>
      <img src={user?.photoURL || defaultPhotoURL} alt="Avatar" className="avatar-details" />
      <div className='user-card-details'>
        <div className='user-info'>
          <h3>{user.name} {user.surname}</h3>
          <p>@{user.handle}</p>
        </div>
        {user.bio && <p>{user.bio}</p>}
        <p>Date of Joining: {timestamp}</p>
      </div>
    </div>
  );
}

UserDetails.propTypes = {
  user: PropTypes.object,
};
