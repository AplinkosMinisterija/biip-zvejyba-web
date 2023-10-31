import Icon, { IconName } from '../other/Icon.tsx';
import styled from 'styled-components';
import { device } from '../../utils/theme.ts';
import { useState } from 'react';
import MobileMenu from '../layouts/MobileMenu.tsx';
import { useNavigate } from 'react-router-dom';

const LogoHeader = ({ back }: any) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <Container>
        {back ? (
          <div onClick={() => navigate(-1)}>
            <StyledIcon name={IconName.back} />
          </div>
        ) : (
          <Logo src={'/logo.svg'} />
        )}
        <Button onClick={() => setShowMenu(true)}>
          <MenuIcon name={IconName.burger} />
          Meniu
        </Button>
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

const Button = styled.div`
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

const Logo = styled.img`
  align-items: center;
  display: flex;
  font-weight: 600;
  gap: 4px;
  text-decoration: none;
`;

const StyledIcon = styled(Icon)`
  font-size: 2rem;
`;

export default LogoHeader;
