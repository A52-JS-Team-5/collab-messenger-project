import PropTypes from 'prop-types';
import QuickReactions from "react-quick-reactions";

export default function MessageReactions({areEmojisVisible, setAreEmojisVisible, onReaction, isMessageImage = false }) {
  const reactionOptions = [
    {
      id: "laughing",
      name: "Laughing",
      content: "😂",
    },
    {
      id: "crying",
      name: "Crying",
      content: "😢",
    },
    {
      id: "heart",
      name: "Heart",
      content: "❤️",
    },
    {
      id: "thumbs-up",
      name: "Thumbs Up",
      content: "👍",
    },
    {
      id: "thumbs-down",
      name: "Thumbs Down",
      content: "👎",
    },
  ];

  return (
    <div className='flex flex-row'>
      <div className={`flex self-center ${isMessageImage ? "pl-12" : "pl-1"} text-xs hover:cursor-pointer`}>
        <QuickReactions
          reactionsArray={reactionOptions}
          placement='right'
          isVisible={areEmojisVisible}
          onClose={() => setAreEmojisVisible(false)}
          onClickReaction={(reaction) => {
            onReaction(reaction.content)
          }}
          trigger={
            <div className='flex self-center' onClick={() => setAreEmojisVisible(!areEmojisVisible)}><i className="fa-regular fa-face-smile opacity-50"></i></div>
          }
        />
      </div>
    </div>
  )
}

MessageReactions.propTypes = {
  areEmojisVisible: PropTypes.bool,
  setAreEmojisVisible: PropTypes.func,
  onReaction: PropTypes.func,
  isMessageImage: PropTypes.bool
}
