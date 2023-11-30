import PropTypes from 'prop-types';
import { sortNamesFromAToZ, sortNamesFromZToA, sortUsersByDate, sortUsersByDateDesc } from '../../services/users.services';

export default function UsersSort({ users, setUsers }) {

  const handleSortChange = (e) => {
    const selectedSortValue = e.target.value;
    sortUsers(selectedSortValue);
  };

  const sortUsers = (sortType) => {
    let sortedUsers = [...users];

    switch (sortType) {
      case 'handleAsc':
        sortedUsers = sortNamesFromAToZ(sortedUsers, 'handle');
        break;
      case 'handleDesc':
        sortedUsers = sortNamesFromZToA(sortedUsers, 'handle');
        break;
      case 'nameAsc':
        sortedUsers = sortNamesFromAToZ(sortedUsers, 'name');
        break;
      case 'nameDesc':
        sortedUsers = sortNamesFromZToA(sortedUsers, 'name');
        break;
      case 'createdOnAsc':
        sortedUsers = sortUsersByDate(sortedUsers);
        break;
      case 'createdOnDesc':
        sortedUsers = sortUsersByDateDesc(sortedUsers);
        break;
      default:
        break;
    }

    setUsers(sortedUsers);
  };

  return (
    <div>
      <select className="select select-secondary bg-white w-full max-w-xs" onChange={handleSortChange} defaultValue='Sort users'>
        <option disabled>Sort users</option>
        <option value="handleAsc">Username (A to Z)</option>
        <option value="handleDesc">Username (Z to A)</option>
        <option value="nameAsc">Name (A to Z)</option>
        <option value="nameDesc">Name (Z to A)</option>
        <option value="createdOnAsc">Date of Joining: Old to New</option>
        <option value="createdOnDesc">Date of Joining: New to Old</option>
      </select>
    </div>
  );
}

UsersSort.propTypes = {
  users: PropTypes.array,
  setUsers: PropTypes.func,
};
