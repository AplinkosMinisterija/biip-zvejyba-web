import styled from 'styled-components';
import { device } from '../../utils/theme.ts';
import Div100vh from 'react-div-100vh';
import LogoHeader from '../headers/LogoHeader.tsx';

const DefaultLayout = ({ children, title, subtitle, back }: any) => {
  return (
    <Container>
      <SideBar></SideBar>
      <ScrollableContainer>
        <InnerContainer>
          <LogoHeader back={back} />
          <Content>
            {title && <Title>{title}</Title>}
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            {children}
          </Content>
        </InnerContainer>
      </ScrollableContainer>
    </Container>
  );
};

const Container = styled(Div100vh)`
  width: 100vw;
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-self: center;
  align-items: center;
  padding: 0 16px 0 16px;
  background-color: white;
  @media ${device.desktop} {
    max-width: 800px;
    border-radius: 16px;
    margin: 40px auto;
    padding: 40px;
    overflow-y: auto;
    height: fit-content;
  }
`;

const SideBar = styled.div`
  display: none;
  background-color: white;
  height: 100%;
  width: 300px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.02);
  @media ${device.desktop} {
    display: flex;
  }
`;

const ScrollableContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: white;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  @media ${device.desktop} {
    padding: 0 16px;
    height: fit-content;
    background-color: #f7f7f7;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 3.2rem;
  font-weight: 800;
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 26px;
  margin-top: 4px;
  font-size: 1.6rem;
  margin-bottom: 32px;
`;

export default DefaultLayout;
