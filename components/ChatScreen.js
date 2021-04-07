import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { Avatar, Badge, Button, Dialog, IconButton, withStyles } from '@material-ui/core';
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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';


function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const [upload, setUpload] = useState(null);
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
        db.collection('users').where('email', '==', getRecipientEmail(JSON.parse(chat).users, user))
    )

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const [open, setAlertOpen] = useState(false);

    const handleClickOpen = () => {
        setAlertOpen(true);
    };
    const AlertHandleClose = () => {
        setAlertOpen(false);
    };

    
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
        const messageRef = db.collection('chats').doc(router.query.id).collection('messages')
        const userIsTypingRef = db.collection('chats').doc(router.query.id).collection('isTyping').doc(user.email)
        const recipientIsTypingRef = db.collection('chats').doc(router.query.id).collection('isTyping').doc(recipientEmail)

        messagesSnapshot?.docs.map((message) => {
            messageRef.doc(message.id).delete()
        })

        userIsTypingRef.delete()
        recipientIsTypingRef.delete()
        
        
        db.collection("chats").doc(router.query.id).delete().then(() => router.push('/'))
    }

    const sendMessage = async (e) => {
        e.preventDefault()

        //easter egg!
        if (input === '*#easter') {
            return db.collection('users').get().then(snap => {
                setInput('')
                return alert(`Total users: ${snap.size}`)
            });
        }

        //upload logic
        let imageDownloadURL;
        let attachmentDownloadURL;
        if (upload !== null) {
            const fileType = upload['type'];
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

            if (validImageTypes.includes(fileType)) {
                const imageStorageRef = firebase.storage().ref('images').child(upload.name);
                await imageStorageRef.put(upload);
                imageDownloadURL = await imageStorageRef.getDownloadURL()
            }

            if (!validImageTypes.includes(fileType)) {
                const attachmentStorageRef = firebase.storage().ref('attachment').child(upload.name);
                await attachmentStorageRef.put(upload);
                attachmentDownloadURL = await attachmentStorageRef.getDownloadURL()
            }
        }

        //update the last seen
        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true});

        //add the message
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input.trim(),
            user: user.email,
            photoURL: user.photoURL,
            imageDownloadURL: imageDownloadURL ? imageDownloadURL : '',
            attachmentDownloadURL: attachmentDownloadURL ? attachmentDownloadURL : ''
        })

        //update the timestamp
        db.collection('chats').doc(router.query.id).set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true});

        setInput('');
        setUpload(null);
        scrollToBottom();
    }

    const uploadFile = (e) => {
        setUpload(e.target.files[0]);
        e.target.value = null;
    }

    const canceluploadFile = (e) => {
        setUpload(null);
    }

    useEffect(() => {
        db.collection('chats').doc(router.query.id).collection('isTyping').doc(user.email).set({input})
    }, [input])

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(JSON.parse(chat).users, user)


    
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

    const lastSeenTimestamp = (timestamp) => {
        const date = new Date();
        const thatTime = timestamp?.toDate()
        const threeMin = 1*60*1000;

        return (date - thatTime) < threeMin
    }

    const StyledBadge = withStyles((theme) => ({
        badge: {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
        },
    }))(Badge);

    return (
        <Container>
            <Header>
                <Link href="/">
                    <ResponsiveIconButton>
                        <IconButton style={{ paddingRight: 0, color: '#b5b7c2' }}>
                            <ArrowBackIosIcon style={{ fontSize: 30, color: '#b5b7c2' }}/>
                        </IconButton>
                        
                    </ResponsiveIconButton>
                </Link>
                <StyledBadge 
                    invisible={!lastSeenTimestamp(recipient?.lastSeen)}
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }} 
                    variant="dot">
                        <Avatar src={recipient?.photoURL} />
                </StyledBadge>
                <HeaderInfo>
                    <h4>{recipient?.userName ? recipient?.userName : recipientEmail}</h4>
                    {recipientSnapshot ? (
                        
                        lastSeenTimestamp(recipient?.lastSeen) ? <p>Active now</p> : 
                        recipient?.lastSeen?.toDate() ? (
                        <p>Active <TimeAgo datetime={recipient?.lastSeen?.toDate()} /></p>
                        ) : <p>User is not registered</p>
                        
                        
                    ) : (
                        <p>Loading last active...</p>
                    )}
                </HeaderInfo>
                <HeaderIcons>
                    {
                        upload !== null ?
                        <IconButton style={{color:'#b5b7c2'}} aria-label="upload picture">
                            <HighlightOffIcon style={{ fontSize: 25, color: '#dc2f02' }} onClick={canceluploadFile}/>
                        </IconButton>
                        : ''
                    }
                    <input style={{ display: 'none' }} id="icon-button-file" type="file" onChange={uploadFile} />
                    <label htmlFor="icon-button-file">
                        <IconButton style={{color:'#b5b7c2'}} aria-label="upload picture" component="span">

                            {
                                upload !== null ?
                                <AttachFileIcon style={{ fontSize: 25, color: '#8f8ce7' }}/> 
                                : <AttachFileIcon style={{ fontSize: 25 }}/>
                            }
                            
                        </IconButton>
                    </label>
                    
                    <IconButton style={{color:'#b5b7c2'}} onClick={handleClickOpen}>
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
                <SendIconButton>
                    <IconButton disabled={!input && !upload} type="submit" onClick={sendMessage}>
                    {
                        upload !== null ?
                        <SendIcon style={{ fontSize: 25, color: '#8f8ce7' }}/> 
                        : <SendIcon style={{ fontSize: 25, color: '#b5b7c2'}} />
                    }
                        
                    </IconButton>
                </SendIconButton>
            </InputContainer>



            <Dialog open={open} onClose={AlertHandleClose}>
            <DialogTitle>Do you want to remove this conversation?</DialogTitle>
            <ButtonContainer>
                <Button onClick={removeConversation} variant="outlined" size="large" style={{color: "#dc2f02", borderColor: "#dc2f02"}}>Agree</Button>
                <Button size="large" onClick={AlertHandleClose} variant="outlined">
                Disagree
                </Button>
            </ButtonContainer>
            </Dialog>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`
`;

const DialogTitle = styled.h1`
color: #8f8ce7;
font-size: 2rem;
margin: 1.5rem 2.5rem;

@media (min-width: 45rem) {
    font-size: 2.5rem;
    margin: 2rem 3rem;
}
`;

const ButtonContainer = styled.div`
display: flex;
justify-content: space-around;
margin: 0 7rem 2rem 7rem;
align-items: center;

@media (min-width: 45rem) {
  margin: 0 19rem 2rem 19rem;
}
`;

const FileInfo = styled.p`
`;

const ResponsiveIconButton = styled.div`
    align-items: center;

    line-height: 1;
    @media (min-width: 45rem) {
        display: none;
    }
`;

const SendIconButton = styled.div`
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
    position: fixed;
    width: 100%;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 1rem;
    height: 7rem;
    align-items: center;
    line-height: 1;

    @media (min-width: 45rem) {
        padding: 1.1rem 2rem;
        position: sticky;
    }
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
        color: #A5A9B6;
    }
`;

const EndOfMessages = styled.div`
    padding-bottom: 7rem;

    @media (min-width: 45rem) {
        padding-bottom: 1.6rem;
    }
    
`;

const HeaderIcons = styled.div`

`;

const MessageContainer = styled.div`
    padding: 7.5rem 2rem 2rem 2rem;

    @media (min-width: 45rem) {
        padding: 2rem;
    }
`;