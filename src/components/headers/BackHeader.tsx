import Icon, { IconName } from '../other/Icon';
import styled from 'styled-components';
import { device } from '../../utils/theme';

const BackHeader = ({ title }: any) => {
  return (
    <Container>
      <BackIcon name={IconName.back} />
      {title ? <Title>{title}</Title> : null}
      <Menu>
        <MenuIcon name={IconName.burger} />
        Meniu
      </Menu>
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  height: 80px;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
  background-color: white;
  @media ${device.desktop} {
    display: none;
  }
`;

const Menu = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  font-weight: 600;
  gap: 4px;
`;

const MenuIcon = styled(Icon)`
  margin-right: 4px;
  font-size: 2rem;
`;

const BackIcon = styled(Icon)`
  align-items: center;
  display: flex;
  gap: 4px;
  text-decoration: none;
`;

const Title = styled.div`
  flex-grow: 1;
  text-align: center;
`;

export default BackHeader;
