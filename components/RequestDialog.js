import { Avatar, Dialog, IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import BlockIcon from '@material-ui/icons/Block';
import styled from 'styled-components';
import firebase from 'firebase';
import { auth, db } from "../firebase";

function RequestDialog({ onClose, open }) {
    const [userLoggedIn] = useAuthState(auth)
    const [requests, setRequests] = useState([])

    const requestsRef = db.collection('users').doc(userLoggedIn.uid).collection('friendRequests')
    const [requestsSnapshot] = useCollection(requestsRef)

    useEffect(() => {
        const requests = requestsSnapshot?.docs.map((requestSnapshot) => ({
            uid: requestSnapshot.id,
            request: requestSnapshot?.data()
        }));

        setRequests(requests);
    }, [requestsSnapshot])

    const createChat = (request) => {
        db.collection('chats').add({
            users: [userLoggedIn.email, request.request.email],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(() => {
            requestsRef.doc(request.uid).delete().then(() => {
                onClose()
                alert('You guys are friends now!')
            })
        })
    }

    const removeRequest = (request) => {
        requestsRef.doc(request.uid).delete().then(() => {
            onClose()
        })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Friend Requests</DialogTitle>
            {!requests?.length > 0 ? <NoRequests>There are no pending friend requests.</NoRequests> : 
                requests?.map((request) => (        
                    <Container key={request.request.email}>
                        <UserContainer>
                            <UserAvatar style={{ height: '4.5rem', width: '4.5rem' }} src={request.request.photoURL} />
                            <UserInfo>{request.request.userName}</UserInfo>
                        </UserContainer>
                        
                        <IconButtons>
                            <IconButton onClick={() => createChat(request)} style={{ color:'#8f8ce7', padding: '.7rem' }}>
                                <CheckCircleOutlineIcon style={{ fontSize: 25 }} />
                            </IconButton>
                            <IconButton onClick={() => removeRequest(request)} style={{ color:'#dc2f02', padding: '.7rem' }}>
                                <BlockIcon style={{ fontSize: 25 }} />
                            </IconButton>
                        </IconButtons>
                    </Container>
                ))
            }
        </Dialog>
    )
}

export default RequestDialog;

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 0 2rem 1.5rem 2rem;
    word-wrap: break-word;
    line-height: 1;
`;

const NoRequests = styled.p`
    color: #A5A9B6;
    font-style: italic;
    font-size: 1rem;
    text-align: center;
    margin: 0 0 2rem 0;

    @media (min-width: 45rem) {
        font-size: 1.2rem;
    }
`;

const DialogTitle = styled.h1`
    color: #8f8ce7;
    font-size: 2.5rem;
    margin: 1.5rem 2.5rem;

    @media (min-width: 45rem) {
        font-size: 3rem;
        margin: 2rem 3rem;
    }
`;

const IconButtons = styled.div``;

const UserContainer = styled.div`
    display: flex;
    margin-right: 1rem;
    align-items: center;
    flex: 1;

    @media (min-width: 45rem) {
        margin-right: 10rem;
    }
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
