import React from 'react';
import Div100vh from 'react-div-100vh';
import styled from 'styled-components';
import { descriptions, titles } from '../../utils/texts';

export const MobileLoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <InnerContainer>
        <Image />
        <Box>
          <InfoContainer>
            <Title>{titles.login}</Title>
            <Description>{descriptions.login}</Description>
          </InfoContainer>
          <div>{children}</div>
        </Box>
      </InnerContainer>
    </Container>
  );
};

const Container = styled(Div100vh)`
  width: 100vw;
`;

const InnerContainer = styled.div`
  background-color: white;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  overflow-y: auto;
  position: relative;
`;

const InfoContainer = styled.div`
    display:flex:
    flex-direction:column;
    gap:28px;
    margin:16px;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 28px;
  color: white;
`;

const Description = styled.p`
  font-size: 18px;
  opacity: 1;
  text-align: left;
  color: white;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  position: absolute;
  justify-content: space-between;
`;
const Image = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  &:before {
    background-image: url(/loginBackground.jpg);
    background-position: 50% 0;
    background-repeat: no-repeat;
    background-size: cover;
    content: ' ';
    display: block;
    height: 100%;
    left: 0;
    opacity: 0.16;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
  }
`;
