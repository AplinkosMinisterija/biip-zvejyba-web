import Icon, { IconName } from '../other/Icon.tsx';
import styled from 'styled-components';
import { device } from '../../utils/theme.ts';

const LogoHeader = () => {
    return (
        <Container>
            <Logo src={'/logo.svg'} />
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

const Logo = styled.img`
    align-items: center;
    display: flex;
    font-weight: 600;
    gap: 4px;
    text-decoration: none;
`;

export default LogoHeader;
