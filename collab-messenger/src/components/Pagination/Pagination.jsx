import PropTypes from 'prop-types';

export default function Pagination({ numberOfUsers, usersPerPage, setCurrentPage }) {
  let pages = [];

  for (let index = 1; index <= Math.ceil(numberOfUsers/usersPerPage); index++) {
    pages.push(index)
  }

  return (
      <div className="join">
        {pages.map((page, index) => {
          return <button className='btn btn-square font-bold bg-transparent text-pink text-lg border-grey hover:bg-pureWhite hover:border-transparent' key={index} onClick={() => setCurrentPage(page)}>{page}</button>
        })}
      </div>
  )
}

Pagination.propTypes = {
  numberOfUsers: PropTypes.number,
  usersPerPage: PropTypes.number,
  setCurrentPage: PropTypes.func
};
