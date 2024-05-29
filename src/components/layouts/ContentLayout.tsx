import styled from 'styled-components';
import { JSX } from 'react';
import { AppRoute, device } from '@aplinkosministerija/design-system';
import BackHeader from '../headers/BackHeader';
import LogoHeader from '../headers/LogoHeader';
import { Subtitle, Title } from '../other/CommonStyles';
interface Props {
  children: any;
  title?: string;
  customSubTitle?: any;
  customTitle?: any;
  currentRoute?: AppRoute;
  pageActions?: JSX.Element;
}
const ContentLayout = ({ children, currentRoute }: Props) => {
  return (
    <Container>
      {currentRoute?.back ? <BackHeader /> : <LogoHeader />}
      <InnerContainer>
        {currentRoute?.title && <Title>{currentRoute?.title}</Title>}
        {currentRoute?.title && <Subtitle>{currentRoute?.title}</Subtitle>}
        {children}
      </InnerContainer>
    </Container>
  );
};
export default ContentLayout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  @media ${device.desktop} {
    max-width: 800px;
    padding: 40px 16px;
    margin: 0 auto;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-self: center;
  align-items: center;
  padding: 0 12px;
  background-color: white;
  overflow: hidden;
  @media ${device.desktop} {
    border-radius: 16px;
    margin: 0 auto;
    padding: 40px;
    overflow-y: hidden;
    height: fit-content;
  }
`;
