import PropTypes from 'prop-types';
import GroupChatDefaultAvatar from '../../assets/GroupChatDefaultAvatar.png';

export default function GroupChatAvatar({ chatComponent='' }) {
  return (
    <div className={`chat-image static self-center avatar ${chatComponent === 'ChatInformation' ? 'w-24 h-24 aspect-square' : 'w-10 h-10 aspect-square'}`}>
      <div className="rounded-full">
        <img src={GroupChatDefaultAvatar} />
      </div>
    </div>
  )
}

GroupChatAvatar.propTypes = {
  chatComponent: PropTypes.string
}
