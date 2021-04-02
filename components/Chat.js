import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled  from "styled-components";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";

function Chat({ id, users }) {
    const router = useRouter()
    const [user] = useAuthState(auth);

    const [recipientSnapshot] = useCollection(
        db
        .collection('users')
        .where('email', '==', getRecipientEmail(users, user))
    );

    const [messagesSnapshot] = useCollection(
        db
        .collection("chats")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .limitToLast(1)
    );

    

    const enterChat = () => {
        router.push(`/chats/${id}`)
    }

    const showLastMessage = messagesSnapshot?.docs?.[0]?.data()
    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(users, user)
    
    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar style={{ height: '4.5rem', width: '4.5rem' }} src={recipient?.photoURL} />
            ) : (
                <UserAvatar style={{ height: '4.5rem', width: '4.5rem', fontSize: 25 }} src={recipient?.photoURL}>{recipientEmail[0]}</UserAvatar>
            )}
            
            <ChatInfo>
                <h4>{recipient?.userName ? recipient?.userName : recipientEmail}</h4>
                {showLastMessage ? <p>{user.email === showLastMessage.user ? 'You: ' : ''} {showLastMessage.message}</p> : ''}
                
            </ChatInfo>
        </Container>
    )
}

export default Chat


const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 1.5rem 3rem;
    word-wrap: break-word;
    line-height: 1;
    :hover {
        background-color: #fafafa;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: .5rem;
    margin-right: 1.5rem;
`;

const ChatInfo = styled.div`
    display: flex;
    flex-direction: column;

    > h4 {
        color: #8f8ce7;
        margin: 0 0 3px 0;
        max-width: 220px;
        font-size: 1.8rem;
    }
    > p {
        color: #828d8f;
        font-size: 1.6rem;
        margin: 3px 0 0 0;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: nowrap;
        overflow: hidden;
        line-height: 1;
        max-width: 28rem;
        
        @media (min-width: 45rem) {
            font-size: 1.4rem;
            max-width: 20rem;
        }
    }

    
`;
