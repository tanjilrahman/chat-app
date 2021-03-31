import { Avatar, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function Topbar() {
    const [user] = useAuthState(auth)

    return (
        <Container>
            <LogoContainer>
                <Logo src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
                <h3>Chat App</h3>
            </LogoContainer>
            <UserInfo>
                <UserAvatar src={user.photoURL}/>
                <p>{user.displayName}</p>
                <IconButton style={{color:'#b5b7c2'}} onClick={() => auth.signOut()}>
                    <ExitToAppIcon />
                </IconButton>
            </UserInfo>
        </Container>
    )
}

export default Topbar;

const Container = styled.div`
    height: 10vh;
    background-color: white;
    color: #b5b7c2;
    position: sticky;
    top: 0;
    z-index: 300;
    display: flex;
    border-bottom: 1px solid #ececec;
    padding: 10px 30px;
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 0.5;
`;

const Logo = styled.img`
    height: 55px;
    width: 55px;
    margin-right: 5px;
`;

const UserInfo = styled.div`
    display: flex;
    flex: 0.5;
    width: 180px;
    justify-content: flex-end;
    align-items: center;
    right: 0;

    > p {
        line-height: 1;
        margin-left: 8px;
        font-weight: 500;
    }
`;

const UserAvatar = styled(Avatar)``;


