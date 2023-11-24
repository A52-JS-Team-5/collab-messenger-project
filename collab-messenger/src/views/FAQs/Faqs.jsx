function Faqs () {

return (
    <div>
        <div className="hero my-16 bg-grey">
            <div className="hero-content flex-col lg:flex-row-reverse gap-14">
                <div className='flex flex-col items-center max-lg:items-center max-w-2xl'>
                    <h1 className="text-5xl font-bold text-black max-lg:text-center">Frequently asked questions</h1>
                    <p className="py-6 text-black text-center max-lg:text-center">Where collaboration feels effortless, offering intuitive communication and customizable channels. Stay connected, work together, and unleash your team&apos;s creativity with Chatter - your go-to platform for smooth collaboration!</p>
                </div>
            </div>
        </div>
        <div className='flex flex-col gap-6 px-80 max-xl:px-10 pt-8 pb-8 bg-white text-white'>
                <div className="collapse collapse-arrow bg-black">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <h2>How can I create a team?</h2>
                    </div>
                    <div className="collapse-content text-center">
                        <p>To create a team, navigate to the app&apos;s interface and locate the &quot;Create New Team&quot; option. Give your team a name and add members as needed. Once created, this team space becomes a hub for collaboration. Start conversations, share files, and work together seamlessly within this designated team environment.</p>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-black">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <h2>Can I have private chats within a team?</h2>
                    </div>
                    <div className="collapse-content">
                        <p>You can maintain confidentiality within a team by creating private channels or initiating direct messages. These private chats enable secure discussions among selected team members, ensuring privacy while collaborating on specific topics or projects.</p>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-black">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <h2>How can I join an existing team?</h2>
                    </div>
                    <div className="collapse-content">
                        <p>To join an existing team, you need an invitation from the team owner. Upon receiving the invitation link or request, follow the provided instructions to join. You might also find the team within the app and request access, awaiting approval from the team owner or admin. Once invited and accepted, you&apos;ll have access to the team&apos;s collaborative spaces and discussions.</p>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-black">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <h2>Can I customize the settings within a team?</h2>
                    </div>
                    <div className="collapse-content">
                        <p>The customization of settings and permissions within a team is typically managed by the team owner. As a member, you may have limited control over these configurations. The team owner has the authority to adjust settings, manage permissions, and control access levels for various team functionalities.</p>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-black">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <h2>Is there a limit to the number of teams I can create?</h2>
                    </div>
                    <div className="collapse-content">
                        <p>There is generally no limit to the number of teams you can create or join within the communication application. You&apos;re free to create multiple teams or join existing ones as per your requirements, enabling seamless collaboration across various projects or groups without any predefined restrictions on team creation or membership.</p>
                    </div>
                </div>
            </div>
    </div>
)
}

export default Faqs