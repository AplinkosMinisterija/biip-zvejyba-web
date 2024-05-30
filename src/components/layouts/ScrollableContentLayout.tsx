import BackHeader from '../headers/BackHeader';
import LogoHeader from '../headers/LogoHeader';
import styled from 'styled-components';
import { device } from '../../utils';
import { Subtitle, Title } from '../other/CommonStyles';

const ScrollableContentLayout = ({ currentRoute, children }: any) => {
  return (
    <ScrollableContainer>
      <InnerContainer>
        {currentRoute?.back ? <BackHeader /> : <LogoHeader />}
        <Content>
          {currentRoute?.title && <Title>{currentRoute?.title}</Title>}
          {currentRoute?.title && <Subtitle>{currentRoute?.title}</Subtitle>}
          {children}
        </Content>
      </InnerContainer>
    </ScrollableContainer>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 16px 0 16px;
  background-color: white;
  align-items: center;
  @media ${device.desktop} {
    max-width: 800px;
    border-radius: 16px;
    margin: 0 auto;
    padding: 40px;
    overflow-y: auto;
    height: fit-content;
  }
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
    padding: 40px 16px;
    height: fit-content;
    background-color: #f7f7f7;
  }
`;

export default ScrollableContentLayout;
