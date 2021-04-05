import { auth, db } from '../firebase'
import firebase from 'firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import '../styles/globals.css'
import Index from './login';
import  PageLoad  from '../components/PageLoad';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email,
        userName: user.displayName,
        photoURL: user.photoURL,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true})
    }
  }, [user]);

  if (loading) return <PageLoad />
  if (!user) return <Index />

  return <Component {...pageProps} />
}

export default MyApp
