import { Avatar } from '@material-ui/core';
import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';

function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
    const TypeOfTimestamp = user === userLoggedIn.email ? SenderTimestamp : ReceiverTimestamp;
    const TypeOfAvater = user === userLoggedIn.email ? SenderAvatar : ReceiverAvatar;

    const isToday = (timestamp) => {
        const today = new Date().setHours(0, 0, 0, 0)
        const thatDay = new Date(timestamp).setHours(0, 0, 0, 0)

        if (today === thatDay) return true;
    }

    return (
        <Container>
            {
                user !== userLoggedIn.email ? <TypeOfAvater style={{ height: '3.5rem', width: '3.5rem' }} src={message.photoURL}/> : ''
            }
        
            <TypeOfMessage>
                {message.message}
                <TypeOfTimestamp>
                    {
                        isToday(message.timestamp) ?
                        message.timestamp ? moment(message.timestamp).format('LT') : '...'
                        : message.timestamp ? moment(message.timestamp).format('lll') : '...'
                    }
                </TypeOfTimestamp>
            </TypeOfMessage>
            
            {
                user === userLoggedIn.email ? <TypeOfAvater style={{ height: '3.5rem', width: '3.5rem' }} src={message.photoURL}/> : ''
            }
            
        </Container>
    )
}

export default Message

const Container = styled.div`
    display: flex;
    align-items: flex-end;
`;

const MessageElement = styled.p`
    word-wrap: break-word;
    white-space: pre-wrap;
    width: fit-content;
    padding: 1.3rem 1.7rem;
    border-radius: 1.5rem;
    margin: 2rem 1rem;
    max-width: 60vw;
    position: relative;
    text-align: left;
    
    @media (min-width: 45rem) {
        max-width: 30vw;
    }
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #e9eaff;
    color: #535565;
    
    
`;

const Receiver = styled(MessageElement)`
    background-color: #8f8ce4;
    color: white;

    -webkit-box-shadow: 0px 4px 5px 0px rgba(204,204,204,1);
    -moz-box-shadow: 0px 4px 5px 0px rgba(204,204,204,1);
    box-shadow: 0px 4px 5px 0px rgba(204,204,204,1);
`;

const Timestamp = styled.span`
    color: #535565;
    padding: 1rem;
    font-size: 1.2rem;
    position: absolute;
    bottom: -3.5rem;
    
    width: 60vw;
    
`;

const SenderTimestamp = styled(Timestamp)`
    text-align: right;
    right: 0;
    bottom: -3.4rem;
`;

const ReceiverTimestamp = styled(Timestamp)`
    
    text-align: left;
    left: 0;
`;


const UserAvatar = styled(Avatar)`
    
`;

const SenderAvatar = styled(UserAvatar)`
    bottom: 2rem;
`;

const ReceiverAvatar = styled(UserAvatar)`
    bottom: 1.9rem;
`;
