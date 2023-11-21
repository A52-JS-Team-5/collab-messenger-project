import { useContext } from 'react';
import AppContext from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function AuthenticatedRoute({ children }) {
  const { user } = useContext(AppContext);
  const location = useLocation();

  if (user === null) {
    return (
      <Navigate to="/" path={location.pathname}>
        {' '}
      </Navigate>
    );
  }

  return children;
}

AuthenticatedRoute.propTypes = {
  children: PropTypes.node,
};
