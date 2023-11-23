import styled from 'styled-components';
import { device, theme, User } from '../../utils';
import Avatar from './Avatar';

export interface FishStockerItemProps {
  fisher: User;
  onClick: () => void;
  icon?: JSX.Element;
  color?: string;
}

const ProfileCard = ({
  fisher,
  onClick,
  icon,
  color = theme.colors.powder,
}: FishStockerItemProps) => {
  const fullName = `${fisher.firstName} ${fisher.lastName}`;

  return (
    <Container onClick={() => onClick()}>
      <StatusContainer>
        <StyledAvatar
          color={color}
          firstName={fisher.firstName!}
          lastName={fisher.lastName!}
          icon={icon}
        />
      </StatusContainer>
      <Content>
        <FirstRow>
          <TenantName>{fullName}</TenantName>
        </FirstRow>
        <SecondRow>
          <TenantCode>{fisher.email}</TenantCode>
        </SecondRow>
      </Content>
    </Container>
  );
};

const Container = styled.a`
  background: ${({ theme }) => theme.colors.largeButton.GREY};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  opacity: 1;
  width: 100%;
  display: flex;
  vertical-align: middle;
  padding: 12px 0;
  margin: 8px 0;
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media ${device.mobileL} {
    max-width: 100%;
  }

  &:hover,
  &:focus {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const StatusContainer = styled.div`
  display: flex;
`;

const StyledAvatar = styled(Avatar)`
  margin: auto 18px auto 15px;
`;

const Content = styled.div`
  flex: 1;
  flex-direction: column;
  margin: auto 0;
  overflow: hidden;
`;

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 16px;
  justify-content: space-between;
`;

const TenantName = styled.span`
  display: inline-block;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SecondRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 22px;
  align-items: center;
  margin-top: 4px;
`;

const TenantCode = styled.div`
  font: normal normal 600 1.4rem/19px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default ProfileCard;
