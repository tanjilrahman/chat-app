import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {ThreeBounce} from 'better-react-spinkit';

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
                    <h3>Chat App</h3>
                </LogoContainer>
            </Link>
            <UserInfo>
                <UserAvatar style={{ height: '4.5rem', width: '4.5rem' }} onClick={sighOut} src={user.photoURL}/>
                <p>{user.displayName}</p>
            </UserInfo>
        </Container>
    )
}

export default Topbar;

const Container = styled.div`
    height: 8rem;
    background-color: white;
    color: #A5A9B6;
    position: fixed;
    width: 100vw;
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
    flex: 0.5;
    color: #8f8ce7;
    font-size: 2rem;
    line-height: 1;

    @media (min-width: 45rem) {
        flex: 0.2;
    }
    
`;

const ResponsiveIconButton = styled.div`
    align-items: center;
    line-height: 1;
    @media (min-width: 45rem) {
        display: none;
    }
`;

const Logo = styled(ThreeBounce)`
    text-align: center;
`;

const UserInfo = styled.div`
    display: flex;
    flex: 0.5;
    width: 18rem;
    justify-content: flex-end;
    align-items: center;
    right: 0;

    @media (min-width: 45rem) {
        flex: 0.8;
    }

    > p {
        display: none;
        @media (min-width: 45rem) {
            display: block;
            line-height: 1;
            margin-left: .8rem;
            font-weight: 500;
        }
    }
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: .8;
    }
`;


