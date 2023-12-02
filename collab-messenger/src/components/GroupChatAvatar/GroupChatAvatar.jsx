import GroupChatDefaultAvatar from '../../assets/GroupChatDefaultAvatar.png';

export default function GroupChatAvatar() {
  return (
    <div className="chat-image avatar w-10 h-10">
      <div className="rounded-full">
        <img src={GroupChatDefaultAvatar} />
      </div>
    </div>
  )
}