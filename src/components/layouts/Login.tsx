import React from 'react';
import Div100vh from 'react-div-100vh';
import styled from 'styled-components';
import { useWindowSize } from '../../utils';
import { subTitles, titles } from '../../utils/texts';
import { device } from '../../utils/theme';

export const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useWindowSize(device.mobileL);

  return (
    <Container>
      <InnerContainer>
        {!isMobile && <Image />}
        <Box>
          <div>
            <Title>{titles.login}</Title>
            <Description>{subTitles.login}</Description>
          </div>
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
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: bold;
  color: #1121da;
  margin-bottom: 28px;
`;

const Description = styled.p`
  font-size: 18px;
  color: #101010;
  opacity: 1;
  text-align: left;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  overflow-y: auto;
  padding: 50px;
  @media ${device.mobileL} {
    padding: 16px;
    max-width: 100%;
  }
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
