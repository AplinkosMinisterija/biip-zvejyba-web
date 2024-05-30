import styled from 'styled-components';
import { device, useGetCurrentRoute, useWindowSize } from '../../utils';
import Div100vh from 'react-div-100vh';
import SideBar from './SideBar';
import BackHeader from '../headers/BackHeader';
import LogoHeader from '../headers/LogoHeader';
import ScrollableContentLayout from './ScrollableContentLayout';
import ContentLayout from './ContentLayout';

const DefaultLayout = ({ children, onScroll = () => {} }: any) => {
  const isMobile = useWindowSize(device.mobileL);
  const currentRoute = useGetCurrentRoute();
  return (
    <Container>
      {!isMobile && <SideBar />}
      <ScrollableContentLayout currentRoute={currentRoute} onScroll={onScroll}>
        {children}
      </ScrollableContentLayout>
    </Container>
  );
};
export default DefaultLayout;

const Container = styled(Div100vh)`
  width: 100vw;
  display: flex;
  height: 100vh;
  overflow: hidden;
`;
