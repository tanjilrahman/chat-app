import Head from 'next/head';
import styled from 'styled-components';
import Inbox from '../components/Inbox';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import RequestDialog from '../components/RequestDialog';
import { useState } from 'react';

function Home() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <div>
      <Head>
        <title>Chat app</title>
        <link rel="icon" href="/favicon.png" />
        
      </Head>
      <Topbar handleOpen={handleOpen}/>
      <Body>
        <Sidebar />
        <Inbox />
      </Body>
      <RequestDialog open={open} onClose={handleClose}/>
    </div>
  )
}

export default Home;

const Body = styled.div`
  display: flex;
`;

