import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();

  const signIn = () => {
    if (navigator.userAgent.includes("FB")) {
      return alert("Please open the app in your browser.");
    }
    auth
      .signInWithRedirect(provider)
      .then(() => router.push("/"))
      .catch(auth);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <PageHeader>
        <PageSpan>Welcome to,</PageSpan>
        <PageTitle>QuickTalk</PageTitle>
        <PageTag>Simple and fast!</PageTag>
      </PageHeader>
      <Button
        style={{ color: "#8f8ce7", borderColor: "#8f8ce7", fontSize: 15 }}
        variant="outlined"
        onClick={signIn}
      >
        Sign in with Google
      </Button>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;

const PageHeader = styled.div``;

const PageSpan = styled.p`
  color: #a5a9b6;
  margin: 0 0 0 0.2rem;
  font-style: italic;
`;

const PageTitle = styled.h1`
  color: #8f8ce7;
  text-align: center;
  font-size: 5rem;
  margin: 0;
  line-height: 1;
`;

const PageTag = styled.p`
  text-align: center;
  color: #a5a9b6;
  margin: 0rem;
  font-style: italic;
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
