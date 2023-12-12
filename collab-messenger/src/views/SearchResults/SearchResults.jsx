import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/users.services";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../../components/Pagination/Pagination";
import UsersList from "../../components/UsersList/UsersList";
import UsersSort from "../../components/UsersSort/UsersSort";
import EmptyList from "../../components/EmptyList/EmptyList";

export default function SearchResults() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(15);
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
    <div className='mt-4 flex flex-col gap-4 h-[88vh] mt-4 w-full'>
      <div className="p-4 flex flex-row justify-between items-center bg-pureWhite rounded-lg dark:bg-darkFront dark:text-darkText">
        <h2 className='m-3 font-bold text-left'>Found Users Based On Your Search</h2>
        <div className='flex flex-row justify-end pr-4'>
          <UsersSort users={users} setUsers={setUsers} />
        </div>
      </div>
      {numberOfUsers === 0 ? (
        <div className='flex w-full h-full'><EmptyList content={`Oops, no users were found based on your search!`}/></div>
      ) : (
        <>
          <div className='flex flex-col gap-3'>
            <UsersList users={users} />
            <div className="flex flex-row justify-center">
              <Pagination numberOfUsers={numberOfUsers} usersPerPage={usersPerPage} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        </>
      )
      }
    </div>
  )
}