import Div100vh from 'react-div-100vh';
import styled from 'styled-components';
import { useGetCurrentRoute, useWindowSize } from '../../utils';
import { device } from '../../utils';
import SideBar from './SideBar';

const DefaultLayoutWrapper = ({ children }: any) => {
  const isMobile = useWindowSize(device.mobileL);
  const currentRoute = useGetCurrentRoute();

  return (
    <Container>
      {!isMobile && <SideBar />}
      <ScrollableContainer>
        <InnerContainer>
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

export default DefaultLayoutWrapper;
