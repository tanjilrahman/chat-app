import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";

function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(auth)
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Logo src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
                <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
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
    padding: 100px;
    align-items: center;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 30px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.12), 0 2px 3px rgba(0, 0, 0, 0.12);
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;
