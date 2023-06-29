import React from "react";
// react-bootstrap components
import {
  Button,
  Container,
  Image,
} from "react-bootstrap";

function Dashboard() {

  const createEl = () => {
    const frame = document.getElementById('frame');
    let img = document.createElement('img');
    img.src = 'https://media.tenor.com/Aeh_P7EOXtYAAAAi/kuru-k%C3%BCr%C3%BC-rin-r%C4%B1n.gif';
    img.id = 'image-kuru';
    img.onload = () => {
      setTimeout(() => {
        frame.removeChild(img);
      }, 1500);
    }
    frame.appendChild(img);
  }
  return (
    <>
      <Container fluid className="d-flex flex-column align-items-center">
        <div id="frame">
          {/* <Image src="https://media.tenor.com/Aeh_P7EOXtYAAAAi/kuru-k%C3%BCr%C3%BC-rin-r%C4%B1n.gif" id="image-kuru" className="my-3" width={500}></Image> */}
        </div>
        <Button onClick={createEl} className="my-3">kururin</Button>

      </Container>
    </>
  );
}

export default Dashboard;
