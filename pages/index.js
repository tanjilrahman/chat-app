import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Chat app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topbar />
      <Sidebar />
    </div>
  )
}
