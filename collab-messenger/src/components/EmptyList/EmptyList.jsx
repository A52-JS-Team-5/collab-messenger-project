import EmptyImg from '../../assets/empty-icon/EmptyList.svg';
import PropTypes from 'prop-types';

const EmptyList = ({ content }) => {

  return (
    <div className='flex flex-col justify-center gap-5 px-24 max-xl:px-6 py-10 mt-4 w-full items-center'>
      <img src={EmptyImg} id='EmptyList' alt="Empty List Illustration" className='max-h-64' />
      <p className='dark:text-darkText'>{content}</p>
    </div>
  )
}

EmptyList.propTypes = {
  content: PropTypes.string,
};

export default EmptyList;