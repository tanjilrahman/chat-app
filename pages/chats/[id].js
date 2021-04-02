import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import ChatScreen from '../../components/ChatScreen';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { auth, db } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({ chat, messages }) {
    const [user] = useAuthState(auth)
    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(chat.users, user)))

    const recipient = recipientSnapshot?.docs?.[0]?.data()

    return (
        <Container>
            <Head>
                <title>Chat with {recipient?.userName ? recipient?.userName : getRecipientEmail(chat.users, user)}</title>
            </Head>
            <ResponsiveTopbar>
                <Topbar />
            </ResponsiveTopbar>
            
            <Body>
                <ResponsiveSidebar>
                    <Sidebar />
                </ResponsiveSidebar>
                
                <ChatContainer>
                    <ChatScreen chat={chat} messages={messages}/>
                </ChatContainer>
                
            </Body>
            
        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id);

    //prep the messages on the server
    const messagesRes = await ref
        .collection("messages")
        .orderBy("timestamp", "asc")
        .get();

    const messages = messagesRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((messages) => ({
            ...messages,
            timestamp: messages.timestamp.toDate().getTime(),
        }))

    //prep the chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data(),
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat,
        }
    }
}


const Container = styled.div`
    
`;

const Body = styled.div`
    display: flex;
`;


const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    ::-webkit-scrollbar {
        display: none;
    }
    --ms-overflow-style: none;
    scrollbar-width: none;

    @media (min-width: 45rem) {
        padding-top: 8rem;
    }
`;

const ResponsiveSidebar = styled.div`
    display: none;

    @media (min-width: 45rem) {
        min-width: 30rem;
        max-width: 50rem;
        display: block;
    }
`;

const ResponsiveTopbar = styled.div`
    display: none;

    @media (min-width: 45rem) {
        display: block;
    }
`;