function ChatHeader() {
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    )
    const removeConversation = () => {
        const retVal = confirm("Are you sure you want to remove this conversation?");
        if ( retVal == true ) {
            db.collection("chats").doc(router.query.id).delete().then(() => router.push('/'))
        }
    }


    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user)

    return (
        <Header>
            {recipient ? (
                <Avatar src={recipient?.photoURL} />
            ) : (
                <Avatar>{recipientEmail[0]}</Avatar>
            )}
            <HeaderInfo>
                <h3>{recipient?.userName ? recipient?.userName : recipientEmail}</h3>
                {recipientSnapshot ? (
                    recipient?.lastSeen?.toDate() ? (
                        <p>Active <TimeAgo datetime={recipient?.lastSeen?.toDate()} /></p>
                    ) : <p>User is not registered</p>
                ) : (
                    <p>Loading last active...</p>
                )}
            </HeaderInfo>
            <HeaderIcons>
                <IconButton style={{color:'#b5b7c2'}}>
                    <AttachFileIcon />
                </IconButton>
                <IconButton style={{color:'#b5b7c2'}} onClick={removeConversation}>
                    <DeleteForeverIcon />
                </IconButton>
            </HeaderIcons>
        </Header>
    )
}

export default ChatHeader;

const Header = styled.div`
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px 30px;
    height: 80px;
    align-items: center;
`;

const HeaderInfo = styled.div`
    margin-left: 10px;
    flex: 1;
    color: #9a9dac;

    > h3 {
        margin: 14px 0 0 0;
    }

    > p {
        margin: 0 0 14px 0;
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div`

`;

