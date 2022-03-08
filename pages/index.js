import Head from "next/head";
import styled from "styled-components";
import Inbox from "../components/Inbox";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RequestDialog from "../components/RequestDialog";
import { useEffect, useState } from "react";
import AlertDialog from "../components/AlertDialog";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

function Home() {
  const [user] = useAuthState(auth);

  //RequestDialog
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //AlertDialog
  const [AlertOpen, setAlertOpen] = useState(false);

  const handleClickOpen = () => {
    setAlertOpen(true);
  };
  const AlertHandleClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        isOnline: true,
      },
      { merge: true }
    );
  }, []);
  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0"
        ></meta>
        <title>QuickTalk</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Topbar handleOpen={handleOpen} handleClickOpen={handleClickOpen} />
      <Body>
        <Sidebar />
        <Inbox />
      </Body>
      <AlertDialog open={AlertOpen} handleClose={AlertHandleClose} />
      <RequestDialog open={open} onClose={handleClose} />
    </div>
  );
}

export default Home;

const Body = styled.div`
  display: flex;
`;
