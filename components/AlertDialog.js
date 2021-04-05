import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { auth } from '../firebase';

export default function AlertDialog({ handleClose, open }) {
  const router = useRouter();
  const signOut = () => {
    auth.signOut().then(() => router.push('/login'))
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Want to Log Out?</DialogTitle>
      <ButtonContainer>
        <Button size="large" onClick={signOut} variant="outlined"  style={{color: "#8f8ce7", borderColor: "#8f8ce7"}}>Agree</Button>
        <Button size="large" onClick={handleClose} variant="outlined">
        Disagree
        </Button>
      </ButtonContainer>
    </Dialog>
)
}

const DialogTitle = styled.h1`
color: #8f8ce7;
font-size: 2.5rem;
margin: 1.5rem 2.5rem;

@media (min-width: 45rem) {
    font-size: 3rem;
    margin: 2rem 3rem;
}
`;

const ButtonContainer = styled.div`
display: flex;
justify-content: space-around;
margin: 0 3.5rem 2rem 3.5rem;
align-items: center;

@media (min-width: 45rem) {
  margin: 0 6rem 2rem 6rem;
}
`;
