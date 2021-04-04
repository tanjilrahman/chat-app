import { Avatar, IconButton } from "@material-ui/core";
import firebase from 'firebase';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled  from "styled-components";
import { auth, db } from "../firebase";

function User({ user, setInput }) {
    const [userLoggedIn] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', userLoggedIn.email);
    const [chatsSnapshot] = useCollection(userChatRef)

    const createChat = () => {
        if (!chatAlreadyExists(user.email) && user.email !== userLoggedIn.email) {
            db.collection('chats').add({
                users: [userLoggedIn.email, user.email],
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => setInput(''))
        } else {
            alert('Please enter a valid email!')
        }
    }

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
    
    return (
        <Container>
            <UserContainer>
                <UserAvatar style={{ height: '4.5rem', width: '4.5rem' }} src={user?.photoURL} />
                 <UserInfo>{user?.userName}</UserInfo>
            </UserContainer>
            

            <IconButton onClick={createChat} style={{ color:'#b5b7c2' }}>
                <PersonAddIcon style={{ fontSize: 30 }} />
            </IconButton>
        </Container>
    )
}

export default User;


const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 1.5rem 2rem;
    word-wrap: break-word;
    line-height: 1;
    :hover {
        background-color: #fafafa;
    }
    -webkit-tap-highlight-color: transparent;
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
`;

const UserAvatar = styled(Avatar)`
    margin: .5rem;
    margin-right: 1.5rem;
`;

const UserInfo = styled.h4`

    color: #8f8ce7;
    max-width: 220px;
    font-size: 1.8rem;
 
`;







// const createChat = (e) => {
//     e.preventDefault();
//     if (!input) return null;

//     if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
//         db.collection('chats').add({
//             users: [user.email, input],
//             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//         })

//         setInput('')
//     } else {
//         alert('Please enter a valid email!')
//     }
// }

// const chatAlreadyExists = (recipientEmail) => 
//     !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
// );