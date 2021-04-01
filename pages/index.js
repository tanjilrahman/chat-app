import Head from 'next/head';
import styled from 'styled-components';
import Inbox from '../components/Inbox';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

function Home() {
  return (
    <div>
      <Head>
        <title>Chat app</title>
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      <Topbar />
      <Body>
        <Sidebar />
        <Inbox />
      </Body>
    </div>
  )
}

export default Home;

const Body = styled.div`
  display: flex;
`;

