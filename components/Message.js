import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';

function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
    const TypeOfTimestamp = user === userLoggedIn.email ? SenderTimestamp : ReceiverTimestamp;

    const isToday = (timestamp) => {
        const today = new Date().setHours(0, 0, 0, 0)
        const thatDay = new Date(timestamp).setHours(0, 0, 0, 0)

        if (today === thatDay) return true;
    }

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <TypeOfTimestamp>
                    {
                        isToday(message.timestamp) ?
                        message.timestamp ? moment(message.timestamp).format('LT') : '...'
                        : message.timestamp ? moment(message.timestamp).format('l') : '...'
                    }
                </TypeOfTimestamp>
            </TypeOfMessage>
        </Container>
    )
}

export default Message

const Container = styled.div`
`;

const MessageElement = styled.p`
    word-wrap: break-word;
    white-space: pre-wrap;
    width: fit-content;
    padding: 1.8rem;
    border-radius: .5rem;
    margin: 1rem;
    min-width: 7rem;
    max-width: 30vw;
    position: relative;
    text-align: left;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #e9eaff;
    color: #535565;
    
`;

const Receiver = styled(MessageElement)`
    background-color: #8f8ce4;
    color: white;
`;

const Timestamp = styled.span`
    color: #535565;
    padding: 1rem;
    font-size: 1.2rem;
    position: absolute;
    bottom: -3.6rem;
    text-align: right;
    
`;

const SenderTimestamp = styled(Timestamp)`
    right: 0;
`;

const ReceiverTimestamp = styled(Timestamp)`
    left: 0;
`;