import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { Avatar, IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import Message from './Message';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react'


function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef(null);
    const router = useRouter();
    const [messagesSnapshot] = useCollection(
        db
        .collection("chats")
        .doc(router.query.id)
        .collection("messages")
        .orderBy("timestamp", "asc")
    );
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    )

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    
    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => {
                scrollToBottom()
                return (
                    <Message key={message.id} user={message.data().user} message={{
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime()
                        }}
                    />
                )
                
            })
        } 
        else {
            return JSON.parse(messages).map((message) => {
                scrollToBottom()
                return (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            )})
        }
    }

    const removeConversation = () => {
        const retVal = confirm("Are you sure you want to remove this conversation?");
        if ( retVal == true ) {
            db.collection("chats").doc(router.query.id).delete().then(() => router.push('/'))
        }
    }

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
        scrollToBottom()
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user)
    
    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
                <HeaderInfo>
                    <h3>{recipient?.userName ? recipient?.userName : recipientEmail}</h3>
                    {recipientSnapshot ? (
                        recipient?.lastSeen?.toDate() ? (
                            <p>Active <TimeAgo datetime={recipient?.lastSeen?.toDate()} /></p>
                        ) : <p>User is not registered</p>
                    ) : (
                        <p>Loading last active...</p>
                    )}
                </HeaderInfo>
                <HeaderIcons>
                    <IconButton style={{color:'#b5b7c2'}}>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton style={{color:'#b5b7c2'}} onClick={removeConversation}>
                        <DeleteForeverIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}

                <EndOfMessages ref={endOfMessagesRef}/>
            </MessageContainer>

            <InputContainer>
                <Input placeholder='Write a message...' value={input} onChange={e => setInput(e.target.value)}/>
                <SendIconButton disabled={!input} type="submit" onClick={sendMessage}>
                    <IconButton style={{ marginRight: '10px' }}>
                        <SendIcon />
                    </IconButton>
                </SendIconButton>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`
`;

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
    position: sticky;
    bottom: 0;
    background-color: #fafafa;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    font-size: 16px;
    outline: 0;
    border: none;
    background-color: #fafafa;
    margin-left: 15px;
    margin-right: 15px;
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px 30px;
    height: 80px;
    align-items: center;
`;

const HeaderInfo = styled.div`
    margin-left: 10px;
    flex: 1;
    color: #9a9dac;

    > h3 {
        margin: 14px 0 0 0;
    }

    > p {
        margin: 0 0 14px 0;
        font-size: 14px;
        color: gray;
    }
`;

const EndOfMessages = styled.div`
`;

const HeaderIcons = styled.div`

`;

const MessageContainer = styled.div`
    padding: 30px;
    min-height: 90vh
`;