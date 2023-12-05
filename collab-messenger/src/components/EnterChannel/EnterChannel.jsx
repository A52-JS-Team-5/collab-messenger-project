import StartChatting from '../../assets/start-chatting/start-chatting.svg'

const EnterChannel = () => {

    return (
        <div className='flex flex-col items-center gap-5 px-40 max-xl:px-6 py-12 h-full w-full justify-center dark:text-darkText'>
            <img src={StartChatting} id='EmptyList' alt="Empty List Illustration" className='max-h-64' />
            <div className='flex flex-col gap-2'>
                <h1 className='text-xl font-bold'>Ready to dive into conversation?</h1>
                <p>Just click on a channel to kick off the chat!</p>
            </div>
        </div>
    )
}

export default EnterChannel;