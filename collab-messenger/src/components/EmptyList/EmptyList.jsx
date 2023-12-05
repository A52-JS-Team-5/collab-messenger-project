import EmptyImg from '../../assets/empty-icon/EmptyList.svg'

const EmptyList = () => {

  return (
    <div className='flex flex-col justify-center gap-5 px-24 max-xl:px-6 py-10 mt-4 w-full items-center'>
      <img src={EmptyImg} id='EmptyList' alt="Empty List Illustration" className='max-h-64'/>
      <h1 className='text-xl font-bold dark:text-darkText'>Nothing to Show Yet.</h1>
    </div>
  )
}

export default EmptyList;