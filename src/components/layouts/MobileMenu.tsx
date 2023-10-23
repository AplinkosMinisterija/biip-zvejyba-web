import styled from 'styled-components';
import Icon, { IconName } from '../other/Icon';
import Modal from './Modal';
import { device } from '../../utils/theme';
import MenuButton from '../buttons/MenuButton.tsx';
import { slugs } from '../../utils/routes.tsx';
import { useNavigate } from 'react-router-dom';

const MobileMenu = ({ onClose, visible = true }: any) => {
    const navigate = useNavigate();
    return (
        <Modal visible={visible} onClose={onClose}>
            <Container>
                <Header>
                    <IconContainer onClick={onClose}>
                        <StyledIcon name="close" />
                        Uždaryti
                    </IconContainer>
                </Header>
                <Headings>
                    <Title>Meniu</Title>
                    <Subtitle>Pasirinkite dominančią sritį</Subtitle>
                </Headings>
                <>
                    <MenuButton
                        label="Mano žvejyba"
                        icon={IconName.home}
                        onClick={() => navigate(slugs.fishingLocation)}
                    />
                    <MenuButton
                        label="Įrankiai"
                        icon={IconName.hook}
                        onClick={() => navigate(slugs.tools)}
                    />
                    <MenuButton label="Atsijungti" icon={IconName.logout} onClick={() => {}} />
                </>
            </Container>
        </Modal>
    );
};

const StyledIcon = styled(Icon)`
    cursor: pointer;
    font-size: 2.4rem;
`;

const Container = styled.div<{ width?: string }>`
    background-color: white;
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 16px;
    @media ${device.desktop} {
        max-width: 700px;
        margin: 40px auto;
        padding: 40px;
        flex-basis: auto;
        border-radius: 16px;
    }
`;

const IconContainer = styled.div`
    align-items: center;
    display: flex;
    font-weight: 600;
    gap: 4px;
    text-decoration: none;
    margin: 0 0 0 auto;
`;
const Header = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;
    height: 48px;
    justify-content: space-between;
    margin: 16px 0;
`;

const Headings = styled.div`
    margin: 16px 0 32px 0;
    justify-content: center;
`;
const Title = styled.div`
    font-size: 32px;
    font-weight: 800;
    text-align: center;
`;
const Subtitle = styled.div`
    line-height: 26px;
    margin-top: 4px;
    text-align: center;
`;
export default MobileMenu;
