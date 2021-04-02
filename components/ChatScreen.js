import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { Avatar, IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Message from './Message';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useEffect, useRef, useState } from 'react';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react'
import TextareaAutosize from 'react-textarea-autosize';
import IsTyping from './IsTyping';
import Link from 'next/link';


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

    useEffect(() => {
        db.collection('chats').doc(router.query.id).collection('isTyping').doc(user.email).set({input})
    }, [input])

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user)


    
    const [isTyping, setIsTyping] = useState('');
    const [isTypingSnapshot] = useCollection(
        db
        .collection("chats")
        .doc(router.query.id)
        .collection("isTyping")
        .doc(recipientEmail)
    );

    useEffect(() => {
        const unsubscribe = () => {
            if (isTypingSnapshot) {
                const data = isTypingSnapshot.data()?.input
                setIsTyping(data)
            } 
        };

        return unsubscribe()
    }, [isTypingSnapshot])

    const typing = () => {
        if (isTyping?.length > 0 && user !== user.email) {
            return <IsTyping photo={recipient?.photoURL} />
        }
    }

    
    return (
        <Container>
            <Header>
                <Link href="/">
                    <ResponsiveIconButton>
                        <ArrowBackIosIcon style={{ fontSize: 30, color: '#b5b7c2' }}/>
                    </ResponsiveIconButton>
                </Link>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar style={{ fontSize: 25 }} >{recipientEmail[0]}</Avatar>
                )}
                <HeaderInfo>
                    <h4>{recipient?.userName ? recipient?.userName : recipientEmail}</h4>
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
                        <AttachFileIcon style={{ fontSize: 25 }}/>
                    </IconButton>
                    <IconButton style={{color:'#b5b7c2'}} onClick={removeConversation}>
                        <DeleteForeverIcon style={{ fontSize: 25 }}/>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                {typing()}
                <EndOfMessages ref={endOfMessagesRef}/>
            </MessageContainer>

            <InputContainer>
                <Input maxRows={8} autoFocus placeholder='Write a message...' value={input} onChange={e => setInput(e.target.value)}/>
                <SendIconButton disabled={!input} type="submit" onClick={sendMessage}>
                    <IconButton>
                        <SendIcon style={{ fontSize: 25, color: '#b5b7c2'}} />
                    </IconButton>
                </SendIconButton>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`
`;

const ResponsiveIconButton = styled.div`
    align-items: center;
    line-height: 1;
    @media (min-width: 45rem) {
        display: none;
    }
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
    padding: .5rem 1.5rem;
    position: fixed;
    width: 100%;
    flex: 1;
    bottom: 0;
    background-color: #fafafa;
    z-index: 100;

    @media (min-width: 45rem) {
        position: sticky;
    }
`;

const Input = styled(TextareaAutosize)`
    overflow: hidden;
    resize: none;
    flex: 1;
    font-family: 'Poppins', sans-serif;
    font-size: 1.6rem;
    height: 5rem;
    outline: 0;
    border: none;
    background-color: #fafafa;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 1.1rem 2rem;
    height: 7rem;
    align-items: center;
    line-height: 1;
`;

const HeaderInfo = styled.div`
    margin-left: 1rem;
    flex: 1;
    color: #b5b7c2;

    > h4 {
        color: #8f8ce7;
        margin: 1.4rem 0 .5rem 0;
    }

    > p {
        margin: .5rem 0 1.4rem 0;
        font-size: 1.4rem;
        color: gray;
    }
`;

const EndOfMessages = styled.div`
    /* padding-bottom: 8rem;

    @media (min-width: 45rem) {
        padding-bottom: 2rem;
    } */
    
`;

const HeaderIcons = styled.div`

`;

const MessageContainer = styled.div`
    padding: 2rem;
`;