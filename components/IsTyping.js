import {ThreeBounce} from 'better-react-spinkit';
import styled from 'styled-components';

function IsTyping() {
    return (
        <Typing>
            <ThreeBounce color="white"/>
        </Typing>
    )
}

export default IsTyping

const Typing = styled.div`
    color: white;
    size: 10;
    width: fit-content;
    padding: 1.8rem;
    border-radius: .5rem;
    margin: 1rem;
    min-width: 7rem;
    position: relative;
    text-align: center;
    background-color: #8f8ce4;
    color: white;
    line-height: 1;
`;
