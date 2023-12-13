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
    <div className='mt-4 flex flex-col gap-4 mt-4 w-full h-[76%] min-[390px]:h-[84%] min-[768px]:h-[80%] min-[1180px]:h-[82%] min-[1280px]:h-[90%]'>
      <div className="h-1/6 p-4 flex flex-row justify-between items-center bg-pureWhite rounded-lg dark:bg-darkFront dark:text-darkText gap-2">
        <h2 className='m-2 md:m-3 font-bold text-left text-md md:text-lg'>Found Users Based On Your Search</h2>
        <div className='flex flex-row justify-end pr-4'>
          <UsersSort users={users} setUsers={setUsers} />
        </div>
      </div>
      {numberOfUsers === 0 ? (
        <div className='flex w-full h-full'><EmptyList content={`Oops, no users were found based on your search!`}/></div>
      ) : (
        <div className='flex flex-col h-5/6'>
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:[width:8px]
                [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:[&::-webkit-scrollbar-thumb]:bg-mint">
            <UsersList users={users} />
          </div>
          <div className="self-end w-full my-2">
            <Pagination numberOfUsers={numberOfUsers} usersPerPage={usersPerPage} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      )
      }
    </div>
  )
}