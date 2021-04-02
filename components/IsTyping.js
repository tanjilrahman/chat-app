import { Avatar } from '@material-ui/core';
import {ThreeBounce} from 'better-react-spinkit';
import styled from 'styled-components';

function IsTyping({ photo }) {
    return (
        <Container>
            <Avatar style={{ height: '3.5rem', width: '3.5rem', bottom: '1.9rem' }}  src={photo}/>
            <Typing>
                <ThreeBounce color="white"/>
            </Typing>
        </Container>
        
    )
}

export default IsTyping

const Container = styled.div`
    display: flex;
    align-items: flex-end;
`;

const Typing = styled.div`
    color: white;
    size: 10;
    width: fit-content;
    position: relative;
    text-align: center;
    background-color: #8f8ce4;
    color: white;
    line-height: 1;
    padding: 1.3rem 1.7rem;
    border-radius: 1.5rem;
    margin: 1.7rem 1rem;

    -webkit-box-shadow: 0px 4px 5px 0px rgba(204,204,204,1);
    -moz-box-shadow: 0px 4px 5px 0px rgba(204,204,204,1);
    box-shadow: 0px 4px 5px 0px rgba(204,204,204,1);
`;
