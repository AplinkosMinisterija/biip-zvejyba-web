import styled from 'styled-components';
import { device, useGetCurrentRoute, useWindowSize } from '../../utils';
import Div100vh from 'react-div-100vh';
import SideBar from './SideBar';
import ScrollableContentLayout from './ScrollableContentLayout';

const DefaultLayout = ({ children }: any) => {
  const isMobile = useWindowSize(device.mobileL);
  const currentRoute = useGetCurrentRoute();
  return (
    <Container>
      {!isMobile && <SideBar />}
      <ScrollableContentLayout currentRoute={currentRoute}>{children}</ScrollableContentLayout>
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
