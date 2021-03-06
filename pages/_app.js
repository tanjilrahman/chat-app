import { auth, db } from "../firebase";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/globals.css";
import Index from "./login";
import PageLoad from "../components/PageLoad";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [isOnline, setIsOnline] = useState(true);
  const handleTabBlur = () => {
    return setIsOnline(false);
  };
  const handleTabFocus = () => {
    return setIsOnline(true);
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleTabBlur);
    document.addEventListener("beforeunload", handleTabBlur);
    return () => {
      window.removeEventListener("beforeunload", handleTabBlur);
      document.removeEventListener("beforeunload", handleTabBlur);
    };
  });
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            email: user.email,
            userName:
              user.email === "tanjil.rahman10@gmail.com"
                ? "Tanjil Rahman 👑"
                : user.displayName,
            photoURL: user.photoURL,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            isOnline,
          },
          { merge: true }
        );
      router.push("/");
    }
  }, [user, isOnline]);

  if (loading) return <PageLoad />;
  if (!user) return <Index />;

  return <Component {...pageProps} />;
};

export default MyApp;
