import DefaultLayoutWrapper from './DefaultLayoutWrapper';
import styled from 'styled-components';
import { IconContainer } from '../other/CommonStyles';
import Icon, { IconName } from '../other/Icon';

const DefaultLayout = ({ children, title, subtitle, back, onEdit }: any) => {
  return (
    <DefaultLayoutWrapper back={back}>
      {title && (
        <TitleWrapper>
          <Title>{title}</Title>
          {onEdit && (
            <IconContainer onClick={() => onEdit()}>
              <EditIcon name={IconName.edit} />
            </IconContainer>
          )}
        </TitleWrapper>
      )}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </DefaultLayoutWrapper>
  );
};
export default DefaultLayout;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
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

const EditIcon = styled(Icon)`
  font-size: 2.8rem;
`;
