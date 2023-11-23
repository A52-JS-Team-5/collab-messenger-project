import EmptyIcon from '../../assets/empty-icon/empty-icon.png'

const EmptyList = () => {

  return (
    <div className='flex flex-row justify-center gap-5 px-24 max-xl:px-6 py-10 mt-4 w-full min-h-[80vh] items-center'>
      <img src={EmptyIcon} id='EmptyList' alt="Empty List Illustration" width={70} />
      <p className='mt-4'>Nothing added yet</p>
    </div>
  )
}

export default EmptyList;