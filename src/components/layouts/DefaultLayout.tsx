import DefaultLayoutWrapper from './DefaultLayoutWrapper';
import styled from 'styled-components';
import { IconContainer } from '../other/CommonStyles';
import Icon, { IconName } from '../other/Icon';

const DefaultLayout = ({ children, title, customTitle, subtitle, back, onEdit }: any) => {
  return (
    <DefaultLayoutWrapper back={back}>
      {customTitle ? customTitle : title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </DefaultLayoutWrapper>
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
