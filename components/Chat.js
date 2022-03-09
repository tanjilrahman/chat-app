import { Avatar, Badge, withStyles } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useEffect, useState } from "react";
import { Circle } from "better-react-spinkit";
import moment from "moment";
import firebase from "firebase";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .limitToLast(1)
  );

  const enterChat = () => {
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        isOnline: true,
      },
      { merge: true }
    );
    if (router.pathname !== "/chats/[id]") {
      setLoading(true);
    }

    router.push(`/chats/${id}`);
  };

  const showLastMessage = messagesSnapshot?.docs?.[0]?.data();
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  }))(Badge);

  useEffect(() => {
    const now = moment().unix();
    const seen = moment(recipient?.lastSeen?.toDate())?.unix();
    const diff = now - seen;
    if (diff > 20) {
      db.collection("users").doc(recipientSnapshot?.docs?.[0]?.id).set(
        {
          isOnline: false,
        },
        { merge: true }
      );
    } else if (diff < 0) {
      db.collection("users").doc(recipientSnapshot?.docs?.[0]?.id).set(
        {
          isOnline: true,
        },
        { merge: true }
      );
    }
  }, [user, recipientSnapshot, recipient]);

  // useEffect(() => {
  //   const now = moment().unix();
  //   const seen = moment(recipient?.lastSeen?.toDate())?.unix();
  //   const diff = now - seen;
  //   if (diff > 20) {
  //     db.collection("users").doc(recipientSnapshot?.docs?.[0]?.id).set(
  //       {
  //         isOnline: false,
  //       },
  //       { merge: true }
  //     );
  //   } else if (diff < 0) {
  //     db.collection("users").doc(recipientSnapshot?.docs?.[0]?.id).set(
  //       {
  //         isOnline: true,
  //       },
  //       { merge: true }
  //     );
  //   }
  // }, [recipientSnapshot, recipient, user]);

  return (
    <div onClick={enterChat}>
      {loading ? (
        <center
          style={{ display: "grid", placeItems: "center", height: "10vh" }}
        >
          <div>
            <Circle color="#8f8ce4" size={68} />
          </div>
        </center>
      ) : (
        <Container>
          <ActiveBadge>
            <StyledBadge
              invisible={!recipient?.isOnline}
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar
                style={{ height: "4.5rem", width: "4.5rem" }}
                src={recipient?.photoURL}
              />
            </StyledBadge>
          </ActiveBadge>

          <ChatInfo>
            <h4>
              {recipient?.userName ? recipient?.userName : recipientEmail}
            </h4>
            {showLastMessage ? (
              <p>
                {user.email === showLastMessage.user ? "You: " : ""}{" "}
                {showLastMessage.message}
              </p>
            ) : (
              ""
            )}
          </ChatInfo>
        </Container>
      )}
    </div>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1.5rem 2rem;
  word-wrap: break-word;
  line-height: 1;
  :hover {
    background-color: #fafafa;
  }
  -webkit-tap-highlight-color: transparent;
`;

const ActiveBadge = styled.div`
  margin: 0.5rem;
  margin-right: 1.5rem;
`;

const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;

  > h4 {
    color: #8f8ce7;
    margin: 0 0 3px 0;
    max-width: 220px;
    font-size: 1.8rem;
  }
  > p {
    color: #a5a9b6;
    font-size: 1.6rem;
    margin: 3px 0 0 0;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: nowrap;
    overflow: hidden;
    line-height: 1;
    max-width: 29rem;

    @media (min-width: 45rem) {
      font-size: 1.4rem;
      max-width: 20rem;
    }
  }
`;
