import styled from 'styled-components';
import Icon, { IconName } from '../other/Icon.tsx';

const MenuButton = ({ label, icon, onClick }: any) => {
  //TODO: disable option
  return (
    <Container onClick={onClick}>
      <IconContainer>
        <StyledIcon name={icon} />
      </IconContainer>
      {label}
      <Icon name={IconName.right} />
    </Container>
  );
};
const Container = styled.div`
  grid-template-columns: 48px 1fr 32px;
  align-items: center;
  font-size: 2rem;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.largeButton.GREY};
  border: 1px solid var(--transparent-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: grid;
  text-decoration: none;
  gap: 12px;
  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;
const IconContainer = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledIcon = styled(Icon)`
  //filter: invert(15%) sepia(56%) saturate(5078%) hue-rotate(226deg) brightness(92%) contrast(97%);
`;

export default MenuButton;
