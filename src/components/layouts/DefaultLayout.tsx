import styled from 'styled-components';
import { device, useGetCurrentRoute, useWindowSize } from '../../utils';
import Div100vh from 'react-div-100vh';
import SideBar from './SideBar';
import BackHeader from '../headers/BackHeader';
import LogoHeader from '../headers/LogoHeader';

const DefaultLayout = ({ children, onScroll = () => {} }: any) => {
  const isMobile = useWindowSize(device.mobileL);
  const currentRoute = useGetCurrentRoute();
  return (
    <Container>
      {!isMobile && <SideBar />}
      <ScrollableContainer onScroll={onScroll}>
        <InnerContainer>
          {currentRoute?.back ? <BackHeader /> : <LogoHeader />}
          <Content>
            {currentRoute?.title && <Title>{currentRoute?.title}</Title>}
            {currentRoute?.title && <Subtitle>{currentRoute?.title}</Subtitle>}
            {children}
          </Content>
        </InnerContainer>
      </ScrollableContainer>
    </Container>
  );
};
export default DefaultLayout;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 3.2rem;
  font-weight: 800;
  text-align: center;
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 26px;
  margin-top: 4px;
  font-size: 1.6rem;
  margin-bottom: 32px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
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

const Container = styled(Div100vh)`
  width: 100vw;
  display: flex;
`;

const ScrollableContainer = styled.div`
  width: 100%;
  min-height: 100%;
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
