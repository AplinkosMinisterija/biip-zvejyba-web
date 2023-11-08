import Div100vh from 'react-div-100vh';
import styled from 'styled-components';
import { useWindowSize } from '../../utils';
import { device } from '../../utils/theme';
import LogoHeader from '../headers/LogoHeader';
import SideBar from '../other/SideBar';

const DefaultLayoutWrapper = ({ children, back }: any) => {
  const isMobile = useWindowSize(device.mobileL);

  return (
    <Container>
      {!isMobile && <SideBar />}
      <ScrollableContainer>
        <InnerContainer>
          <LogoHeader back={back} />
          <Content>{children}</Content>
        </InnerContainer>
      </ScrollableContainer>
    </Container>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 800px;
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

export default DefaultLayoutWrapper;
