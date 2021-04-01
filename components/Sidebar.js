import { IconButton } from '@material-ui/core';
import styled from "styled-components";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import PageLoad from './PageLoad';
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

            <Search>
                <SearchIcon style={{ margin:'0 5px',fontSize: 25 }}/>
                <SearchInput placeholder='Enter an email to add friend' value={input} onChange={e => setInput(e.target.value.toLowerCase())}/>
                <SendIconButton disabled={!input} type="submit" onClick={createChat}>
                    <IconButton style={{ padding:'5px', color:'#b5b7c2' }}>
                        <PersonAddIcon style={{ fontSize: 25 }} />
                    </IconButton>
                </SendIconButton>
            </Search>
            {
                loading ? <PageLoad /> : chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))
            }
        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 0.55;
    height: 92vh;
    border-right: 1px solid #ececec;
    min-width: 30rem;
    max-width: 35rem;
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
    position: sticky;
    z-index: 200;
    top: 0;
    background-color: white;
    color: #b5b7c2;
    display: flex;
    align-items: center;
    padding: 2rem 3rem;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    color: #b5b7c2;
    outline-width: 0;
    height: 4rem;
    border: none;
    flex: 1;
    font-size: 1.4rem;
`;
