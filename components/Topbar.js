import { Avatar, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/router';
import Link from 'next/link'

function Topbar() {
    const [user] = useAuthState(auth)
    const router = useRouter()

    const sighOut = () => {
        auth.signOut().then(() => router.push('/login'))
    }

    return (
        <Container>
            <Link href="/">
                <LogoContainer>
                    <Logo src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
                    <h3>Chat App</h3>
                </LogoContainer>
            </Link>
            <UserInfo>
                <UserAvatar src={user.photoURL}/>
                <p>{user.displayName}</p>
                <IconButton style={{color:'#b5b7c2'}} onClick={sighOut}>
                    <ExitToAppIcon style={{ fontSize: 25 }} />
                </IconButton>
            </UserInfo>
        </Container>
    )
}

export default Topbar;

const Container = styled.div`
    height: 8vh;
    background-color: white;
    color: #b5b7c2;
    position: sticky;
    top: 0;
    z-index: 300;
    display: flex;
    border-bottom: 1px solid #ececec;
    padding: 1rem 3rem;
`;

const LogoContainer = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    flex: 0.2;
`;

const Logo = styled.img`
    height: 5.5rem;
    width: 5.5rem;
    margin-right: .5rem;
`;

const UserInfo = styled.div`
    display: flex;
    flex: 0.8;
    width: 18rem;
    justify-content: flex-end;
    align-items: center;
    right: 0;

    > p {
        line-height: 1;
        margin-left: .8rem;
        font-weight: 500;
    }
`;

const UserAvatar = styled(Avatar)``;


