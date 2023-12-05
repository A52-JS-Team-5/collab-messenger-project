import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/users.services";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../../components/Pagination/Pagination";
import UsersList from "../../components/UsersList/UsersList";
import UsersSort from "../../components/UsersSort/UsersSort";
import EmptyIcon from '../../assets/empty-icon/EmptyList.svg'

export default function SearchResults() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const lastPostIndex = currentPage * usersPerPage;
  const firstPostIndex = lastPostIndex - usersPerPage;
  const location = useLocation();
  const searchTerm = location.state['searchTerm'];

  useEffect(() => {
    getAllUsers()
      .then((usersData) => {
        const foundUsers = usersData.filter((user) => {
          return user.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.teamsMember?.length > 0 && user.teamsMember.some((team) => team.toLowerCase() === searchTerm.toLowerCase());
        });

        setUsers(foundUsers.slice(firstPostIndex, lastPostIndex));
        setNumberOfUsers(foundUsers.length);
      })
      .catch(e => {
        toast('Error getting user data. Please try again.')
        console.log('Error getting users data: ', e.message)
      })
  }, [searchTerm, firstPostIndex, lastPostIndex])

  return (
    <>
      <div className='flex flex-col px-36 max-xl:px-6 py-2 dark:text-darkText'>
        <div className="hero my-7">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-2xl font-bold">Found Users Based On Your Search</h1>
            </div>
          </div>
        </div>
      </div>

      {numberOfUsers.length === 0 ? (
        <div className='flex flex-col justify-center gap-4'>
          <img src={EmptyIcon} id='EmptyList' alt="Empty List Illustration" className='max-h-64' />
          <p className='mt-4'>Oops, no users or teams were found based on your search criteria. Please try again!</p>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row justify-end pr-4'>
              <UsersSort users={users} setUsers={setUsers} />
            </div>
            <UsersList users={users} />
            <div className="flex flex-row justify-center">
              <Pagination numberOfUsers={numberOfUsers} usersPerPage={usersPerPage} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        </>
      )
      }
    </>
  )
}