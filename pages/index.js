import Head from "next/head";
import styled from "styled-components";
import Inbox from "../components/Inbox";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RequestDialog from "../components/RequestDialog";
import { useState } from "react";
import AlertDialog from "../components/AlertDialog";

function Home() {
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
