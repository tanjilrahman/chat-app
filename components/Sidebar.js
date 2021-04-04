import { IconButton } from '@material-ui/core';
import styled from "styled-components";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import firebase from 'firebase';
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
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })

            setInput('')
        } else {
            alert('Please enter a valid email!')
        }

        
    }

    const chatMaps = chatsSnapshot?.docs.map((chat) => ({
        id: chat.id,
        data: chat.data()
    }))

    
    const chats = chatMaps?.sort((chatA, chatB) => {
        const chatATimestamp = chatA.data.timestamp?.toDate().getTime()
        const chatBTimestamp = chatB.data.timestamp?.toDate().getTime()
        if (chatATimestamp > chatBTimestamp) {
            return -1
        } if (chatBTimestamp > chatATimestamp) {
            return 1
        }
    })
    

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

    return (
        <Container>

            <Search>
                <SearchIcon style={{ fontSize: 30 }}/>
                <SearchInput placeholder='Enter an email to add friend' value={input} onChange={e => setInput(e.target.value.toLowerCase())}/>
                <SendIconButton disabled={!input} type="submit" onClick={createChat}>
                    <IconButton style={{ padding:'5px', color:'#b5b7c2' }}>
                        <PersonAddIcon style={{ fontSize: 30 }} />
                    </IconButton>
                </SendIconButton>
            </Search>
            { loading ? <PageLoad /> : (
                chats?.map((chat) => (
                    <Chat key={chat.id} id={chat.id} users={chat.data.users} />
                ))
            ) }
        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 1;
    overflow: scroll;
    padding-top: 8rem;
    height: 100vh;
    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;

    @media (min-width: 45rem) {
        min-width: 35rem;
        max-width: 35rem;
        border-right: 1px solid #ececec;
    }
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
    line-height: 1;
    color: #A5A9B6;
    display: flex;
    align-items: center;
    padding: 1.5rem 2.5rem;
    border-radius: 2px;
    height: 7rem;
    border-bottom: 1px solid #ececec;
    @media (min-width: 45rem) {
        border: none;
    }
`;

const SearchInput = styled.input`
    color: #A5A9B6;
    outline-width: 0;
    height: 4rem;
    border: none;
    flex: 1;
    font-size: 1.6rem;
`;
