import { Avatar, Button } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';

function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
    const TypeOfTimestamp = user === userLoggedIn.email ? SenderTimestamp : ReceiverTimestamp;
    const TypeOfAvater = user === userLoggedIn.email ? SenderAvatar : ReceiverAvatar;
    const TypeOfImg = user === userLoggedIn.email ? SenderImg : ReceiverImg;
    const TypeOfTimestampImg = user === userLoggedIn.email ? SenderTimestampImg : ReceiverTimestampImg;
    const TypeOfmessageImg = user === userLoggedIn.email ? SenderMessageImg : ReceiverMessageImg;

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
            {
                message.imageDownloadURL || message.attachmentDownloadURL ? 
                <TypeOfImg>
                    {
                        message.imageDownloadURL ? 
                            <a target="_blank" rel="noopener noreferrer" href={message.imageDownloadURL} download>
                                <Img src={message.imageDownloadURL}/>
                            </a>
                        :   <Button
                            style={{ width: '100%' }}
                            href={message.attachmentDownloadURL}
                            color="primary"
                            size="large"
                            startIcon={<GetAppIcon />}
                            >
                            Attachment
                            </Button>
                        
                    }
                    
                    {
                        message.message ? 
                        <TypeOfmessageImg>
                            {message.message}
                        </TypeOfmessageImg>
                        : ''
                    }

                    <TypeOfTimestampImg>
                        {
                            isToday(message.timestamp) ?
                            message.timestamp ? moment(message.timestamp).format('LT') : '...'
                            : message.timestamp ? moment(message.timestamp).format('lll') : '...'
                        }
                    </TypeOfTimestampImg> 
                    
                </TypeOfImg> : ''
            }
            

            {
                message.message && !message.imageDownloadURL && !message.attachmentDownloadURL ? 
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
                : ''
            }

            
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

const ImgMessage = styled.p`
    word-wrap: break-word;
    white-space: pre-wrap;
    width: fit-content;
    padding: 1rem 1.7rem;
    margin: 0;
    line-height: 1.5;
    max-width: 60vw;
    @media (min-width: 45rem) {
        max-width: 26.5vw;
    }
`;

const SenderMessageImg = styled(ImgMessage)`
    margin-left: auto;
`;

const ReceiverMessageImg = styled(ImgMessage)`
`;

const TimestampImg = styled.p`
    color: #A5A9B6;
    margin: 0;
    padding: 1.2rem 1rem;
    font-size: 1.2rem;
    position: absolute;
`;

const SenderTimestampImg = styled(TimestampImg)`
    right: 0;
`;

const ReceiverTimestampImg = styled(TimestampImg)`
    left: 0;
`;

const ImgContainer = styled.div`
    max-width: 60vw;
    border-radius: 1.5rem;
    line-height: 0;
    margin: 1.7rem 1rem;
    position: relative;

    @media (min-width: 45rem) {
        max-width: 30vw;
    }
`;

const Img = styled.img`
    max-width: 100%;
    border-radius: 1.5rem;
    object-fit: cover;
    
    @media (min-width: 45rem) {
        max-width: 26.5vw;
    }
`;

const SenderImg = styled(ImgContainer)`
    margin-left: auto;
    background-color: #e9eaff;
    color: #535565;
`;

const ReceiverImg = styled(ImgContainer)`
    background-color: #8f8ce4;
    color: white;
`;

const MessageElement = styled.p`
    word-wrap: break-word;
    white-space: pre-wrap;
    width: fit-content;
    padding: 1.3rem 1.7rem;
    border-radius: 1.5rem;
    margin: 1.7rem 1rem;
    max-width: 60vw;
    position: relative;
    text-align: left;
    line-height: 1.5;
    
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
    color: #A5A9B6;
    padding: 1rem;
    font-size: 1.2rem;
    position: absolute;
    width: 60vw;
    
`;

const SenderTimestamp = styled(Timestamp)`
    text-align: right;
    right: 0;
    bottom: -3.2rem;
`;

const ReceiverTimestamp = styled(Timestamp)`
    bottom: -3.3rem;
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
