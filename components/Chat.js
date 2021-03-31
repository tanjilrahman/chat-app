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
        router.push(`/chat/${id}`)
    }

    const showLastMessage = messagesSnapshot?.docs?.[0]?.data()
    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(users, user)
    console.log(showLastMessage)
    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar style={{ height: '45px', width: '45px' }} src={recipient?.photoURL} />
            ) : (
                <UserAvatar style={{ height: '45px', width: '45px' }} src={recipient?.photoURL}>{recipientEmail[0]}</UserAvatar>
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
    padding: 15px 30px;
    word-wrap: break-word;
    line-height: 1;

    :hover {
        background-color: #fafafa;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;

const ChatInfo = styled.div`
    display: flex;
    flex-direction: column;

    > h4 {
        color: #8f8ce7;
        margin: 0 0 3px 0;
    }
    > p {
        color: #828d8f;
        font-size: 14px;
        margin: 3px 0 0 0;
    }
`;
