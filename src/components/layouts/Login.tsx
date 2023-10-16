import React from 'react';
import Div100vh from 'react-div-100vh';
import styled from 'styled-components';

export const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Div100vh>
      <Container>
        <Image />
        <Box>{children}</Box>
      </Container>
    </Div100vh>
  );
};

export const Container = styled.div`
  background-color: white;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  overflow-y: auto;
  @media only screen and (max-width: 700px) {
    flex-direction: column;
  }
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 812px;
  overflow-y: auto;
  padding: 16px;
  @media only screen and (max-width: 1000px) {
    max-width: 300px;
  }
`;
const Image = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${`/background.jpg`});
  background-position: center;
  position: sticky;
  object-fit: cover;
  top: 0;
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`;

