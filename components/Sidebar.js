import { IconButton } from '@material-ui/core';
import styled from "styled-components";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';

import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import User from './User';
import PageLoad from './PageLoad';
import { useEffect, useState } from 'react';

function Sidebar() {
    const [userLoggedIn] = useAuthState(auth)
    const [input, setInput] = useState('')
    const [AllUsers, setAllUsers] = useState([])

    const userChatRef = db.collection('chats').where('users', 'array-contains', userLoggedIn.email);
    const [chatsSnapshot, loading] = useCollection(userChatRef)

    const usersRef = db.collection('users')
    const [usersSnapshot] = useCollection(usersRef)

    const searchUser = (e) => {
        e.preventDefault();
        const users = usersSnapshot?.docs.map((userSnapshot) => (userSnapshot.data()))
        return filteredUsers(users, input)
    }
    
    
    const filteredUsers = (users, input) => {
        const AllUsers = users?.filter((user) => {
            const users = user?.userName?.toLowerCase().includes(input.toLowerCase())
            const hasInput = input.length > 0

            return users && hasInput && !chatAlreadyExists(user.email) && userLoggedIn.email !== user.email
        })
        setAllUsers(AllUsers)
    }

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
    
    useEffect(() => {
        const users = usersSnapshot?.docs.map((userSnapshot) => (userSnapshot.data()))
        filteredUsers(users, input)
    }, [input])

    

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
    

    return (
        <Container>
            <Search>
                <SearchIcon style={{ fontSize: 30 }}/>
                <SearchInput placeholder='Search people...' value={input} onChange={e => setInput(e.target.value.toLowerCase())}/>
                {/* <SendIconButton disabled={!input} type="submit" onClick={searchUser}>
                    <IconButton style={{ padding:'5px', color:'#b5b7c2' }}>
                        <PersonAddIcon style={{ fontSize: 30 }} />
                    </IconButton>
                </SendIconButton> */}
            </Search>
            { loading ? <PageLoad /> :  
                AllUsers?.length > 0 ? (
                    <SearchResult>
                        <SearchHead>Match</SearchHead>
                        {AllUsers?.map((user) => (
                            <User key={user.email} setInput={setInput} user={user} />
                        ))}
                    </SearchResult>
                    
                ) : (
                    chats?.map((chat) => (
                        <Chat key={chat.id} id={chat.id} users={chat.data.users} />
                    ))
                )
            }
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

const SearchResult = styled.div`
    
    
`;

const SearchHead = styled.h2`
    margin: 0;
    padding: 1rem 2.5rem 0 2.5rem;
    color: #8f8ce7;
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
