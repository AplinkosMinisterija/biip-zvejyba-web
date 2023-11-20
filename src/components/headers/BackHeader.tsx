import Icon, { IconName } from '../other/Icon';
import styled from 'styled-components';
import { device } from '../../utils/theme';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MobileMenu from '../layouts/MobileMenu';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

const BackHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const coordinates = useSelector((state: RootState) => state.fishing.coordinates);

  const navigate = useNavigate();

  return (
    <>
      <Container>
        <div onClick={() => navigate(-1)}>
          <BackIcon name={IconName.back} />
        </div>
        <Coordinates>{`${coordinates?.x},${coordinates?.y}`}</Coordinates>
        <Menu onClick={() => setShowMenu(true)}>
          <MenuIcon name={IconName.burger} />
          Meniu
        </Menu>
      </Container>
      <MobileMenu visible={showMenu} onClose={() => setShowMenu(false)} />
    </>
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

const Coordinates = styled.div`
  font-size: 10px;
`;

export default BackHeader;
