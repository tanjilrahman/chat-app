import styled from 'styled-components';
import SendIcon from '@material-ui/icons/Send';
import { auth, db } from '../firebase';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { IconButton } from '@material-ui/core';

function Input() {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const router = useRouter();

    const sendMessage = (e) => {
        e.preventDefault();

        //update the last seen
        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true});

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        })

        // console.log(messagesSnapshotResult)

        setInput('')
        // scrollToBottom()
    }

    return (
        <InputContainer>
            <InputStyles placeholder='Write a message...' value={input} onChange={e => setInput(e.target.value)}/>
            <SendIconButton disabled={!input} type="submit" onClick={sendMessage}>
                <IconButton style={{ marginRight: '10px' }}>
                    <SendIcon />
                </IconButton>
            </SendIconButton>
        </InputContainer>
    )
}

export default Input


const SendIconButton = styled.button`

    border: none;
    padding: 0;
    margin: 0;
    background: none;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 15px;
    bottom: 0;
    position: sticky;
    background-color: #fafafa;
    z-index: 100;
`;

const InputStyles = styled.input`
    flex: 1;
    font-size: 16px;
    outline: 0;
    border: none;
    background-color: #fafafa;
    margin-left: 15px;
    margin-right: 15px;
`;