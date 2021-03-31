import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';

function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth)

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

    const TypeOfTimestamp = user === userLoggedIn.email ? SenderTimestamp : ReceiverTimestamp;
    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <TypeOfTimestamp>
                    {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
                </TypeOfTimestamp>
            </TypeOfMessage>
        </Container>
    )
}

export default Message

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 5px;
    margin: 10px;
    min-width: 60px;
    position: relative;
    text-align: center;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #e9eaff;
`;

const Receiver = styled(MessageElement)`
    background-color: #8f8ce4;
    text-align: left;
    color: white;
`;

const Timestamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: -30px;
    text-align: right;
    
`;

const SenderTimestamp = styled(Timestamp)`
    right: 0;
`;

const ReceiverTimestamp = styled(Timestamp)`
    left: 0;
`;