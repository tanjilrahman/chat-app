import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";
import { useRouter } from 'next/router';

function Login() {
  const router = useRouter()

    const signIn = () => {
        auth.signInWithPopup(provider).then(() => router.push('/')).catch(auth)
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Button style={{ fontSize: 15 }} onClick={signIn} variant="outlined">Sign in with Google</Button>
            </LoginContainer>
        </Container>
    )
}

export default Login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    padding: 10rem;
    align-items: center;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 3rem;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.12), 0 2px 3px rgba(0, 0, 0, 0.12);
`;
