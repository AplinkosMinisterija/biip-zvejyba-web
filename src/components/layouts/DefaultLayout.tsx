import { Subtitle, Title } from '../other/CommonStyles';
import DefaultLayoutWrapper from './DefaultLayoutWrapper';

const DefaultLayout = ({ children, title, subtitle, back }: any) => {
  return (
    <DefaultLayoutWrapper back={back}>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </DefaultLayoutWrapper>
  );
};

export default DefaultLayout;
