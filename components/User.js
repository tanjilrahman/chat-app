import { Avatar, IconButton } from "@material-ui/core";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled  from "styled-components";
import { auth, db } from "../firebase";

function User({ user, setInput }) {
    const [userLoggedIn] = useAuthState(auth);
    const [exists, setExists] = useState(false)

    const requestsRef = db.collection('users').doc(user.uid).collection('friendRequests').doc(userLoggedIn.uid)
    const [requestsSnapshot] = useCollection(requestsRef)

    const userChatRef = db.collection('chats').where('users', 'array-contains', userLoggedIn.email);
    const [chatsSnapshot] = useCollection(userChatRef)

    const userLoggedInRequestsRef = db.collection('users').doc(userLoggedIn.uid).collection('friendRequests').doc(user.uid)

    const sendRequest = () => {
        userLoggedInRequestsRef.get().then((requestSnapshot) => {
            if (!requestSnapshot.exists) {
                if (!chatAlreadyExists(user?.user.email)) {
                    requestsRef.set({
                        email: userLoggedIn.email,
                        photoURL: userLoggedIn.photoURL,
                        userName: userLoggedIn.displayName
                    }).then(() => {
                        setInput('')
                        alert('Friend request sent!')
                    }).catch((error) => {
                        alert('error: ', error.message)
                    })  
                } else {
                    alert('You guys are friends!')
                }
                
            } else {
                alert('You already have a friend request from this person. Please check your notification.')
            }
        })
        
    }

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

    useEffect(() => {
        if (requestsSnapshot?.exists) {
            setExists(true)
        } else {
            setExists(false)
        }
    }, [requestsSnapshot])

    

    return (
        <Container>
            <UserContainer>
                <UserAvatar style={{ height: '4.5rem', width: '4.5rem' }} src={user?.user.photoURL} />
                 <UserInfo>{user?.user.userName}</UserInfo>
            </UserContainer>
            {
                exists ? <Sent>Request sent!</Sent> : 
                <IconButton onClick={sendRequest} style={{ color:'#b5b7c2' }}>
                    <PersonAddIcon style={{ fontSize: 30 }} />
                </IconButton>
            }
            
        </Container>
    )
}

export default User;


const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 1.5rem 2rem;
    word-wrap: break-word;
    line-height: 1;
`;

const Sent = styled.p`
    color: #8f8ce7;
    font-style: italic;
    font-size: 1.2rem;
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

    color: #A5A9B6;
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







// const createChat = () => {
//     if (!chatAlreadyExists(user.email) && user.email !== userLoggedIn.email) {
//         db.collection('chats').add({
//             users: [userLoggedIn.email, user.email],
//             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//         }).then(() => setInput(''))
//     } else {
//         alert('Please enter a valid email!')
//     }
// }

// const chatAlreadyExists = (recipientEmail) => 
//     !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
// );