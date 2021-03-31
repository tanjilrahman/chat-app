import { Avatar, Button, IconButton } from '@material-ui/core';
import styled from "styled-components";
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import Loading from './Loading';
import { useState } from 'react';

function Sidebar() {
    const [user] = useAuthState(auth)
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [chatsSnapshot, loading] = useCollection(userChatRef)
    const [input, setInput] = useState('')

    const createChat = (e) => {
        e.preventDefault();
        if (!input) return null;

        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            db.collection('chats').add({
                users: [user.email, input],
            })

            setInput('')
        } else {
            alert('Please enter a valid email!')
        }

        
    }

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
    

    return (
        <Container>
            {/* <Header>
                <UserAvatar src={user.photoURL}/>
                <IconContainer>
                    <IconButton onClick={createChat}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={() => auth.signOut()}>
                        <ExitToAppIcon />
                    </IconButton>
                </IconContainer>
            </Header> */}

            <Search>
                <SearchIcon style={{ margin:'0 5px' }}/>
                <SearchInput placeholder='Enter an email to add friend' value={input} onChange={e => setInput(e.target.value.toLowerCase())}/>
                <SendIconButton disabled={!input} type="submit" onClick={createChat}>
                    <IconButton style={{ padding:'5px', color:'#b5b7c2' }}>
                        <ChatIcon  />
                    </IconButton>
                </SendIconButton>
            </Search>

            {/* <SidebarButton onClick={createChat} >Start a new chat</SidebarButton> */}

            {
                loading ? <Loading /> : chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))
            }
        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 0.55;
    border-right: 1px solid #ececec;
    min-width: 300px;
    max-width: 350px;
    overflow: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;
`;

const SendIconButton = styled.button`
    border: none;
    padding: 0;
    margin: 0;
    background: none;
`;

const Search = styled.form`
    color: #b5b7c2;
    display: flex;
    align-items: center;
    padding: 20px 30px;
    border-radius: 2px;
`;

// const SidebarButton = styled(Button)`
//     width: 100%;
//     && {
//         border-top: 1px solid whitesmoke;
//         border-bottom: 1px solid whitesmoke; 
//     }
// `;


const SearchInput = styled.input`
    color: #b5b7c2;
    outline-width: 0;
    border: none;
    flex: 1;
    font-size: 14px;
`;

// const Header = styled.div`
//     display: flex;
//     position: sticky;
//     top: 0;
//     background-color: white;
//     z-index: 1;
//     justify-content: space-between;
//     align-items: center;
//     padding: 15px;
//     height: 80px;
//     border-bottom: 1px solid whitesmoke;
// `;

// const UserAvatar = styled(Avatar)`

// `;

// const IconContainer = styled.div`
// `;