import styled from 'styled-components';

function Inbox() {
    return (
        <Container>
            <Info>
                <h1>Your Messages</h1>
                <p>Send private photos and messages to a friend</p>
            </Info>
            
        </Container>
    )
}

export default Inbox;

const Container = styled.div`
    display: none;

    @media (min-width: 45rem) {
        flex: 1;
        display: grid;
        place-items: center;
        height: 100vh;
    }
`;

const Info = styled.div`
    text-align: center;
    
    > h1 {
        color: #8f8ce7;
        margin: 0;
    }

    > p {
        margin: 1rem 0;
        color: gray;
    }
`;


