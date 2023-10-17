import FishingLocationButton, { Variant } from '../buttons/FishingLocationButton.tsx';
import styled from 'styled-components';
import Popup from '../layouts/Popup.tsx';
import Button, { ButtonColors } from '../buttons/Button.tsx';
import { useState } from 'react';

const FishingLocation = () => {
    const [showStartFishing, setShowStartFishing] = useState(false);
    return (
        <>
            <Container>
                <FishingLocationButton
                    variant={Variant.GHOST_WHITE}
                    title="Kuršių mariose"
                    image={'/marios.avif'}
                    onClick={() => setShowStartFishing(true)}
                />
                <FishingLocationButton variant={Variant.GHOST_WHITE} title="Vidaus vandenyse" image={'/vidaus_vandens_telkiniai.avif'} />
                <FishingLocationButton variant={Variant.GHOST_WHITE} title="Polderiuose" image={'/polderiai.avif'} />
            </Container>
            <Popup visible={showStartFishing} onClose={() => setShowStartFishing(false)}>
                <PopupWrapper>
                    <>
                        <FishingImage src={'/startFishing.svg'} />
                        <Heading>Žvejybos pradžia</Heading>
                        <Description>Lengvai ir paprastai praneškite apie žvejybos pradžią</Description>
                    </>
                    <StyledButton radius="24px">Pradėti žvejybą</StyledButton>
                    <StyledButton variant={ButtonColors.SECONDARY} radius="24px">
                        Neplaukiu žvejoti
                    </StyledButton>
                </PopupWrapper>
            </Popup>
        </>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;
const PopupWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
`;
const FishingImage = styled.img`
    width: 116px;
    height: 116px;
`;

const Heading = styled.div`
    font-size: 3.2rem;
    font-weight: bold;
`;

const Description = styled.div`
    margin-bottom: 40px;
    line-height: 26px;
    text-align: center;
    font-weight: 500;
`;

const StyledButton = styled(Button)`
    font-size: 2rem;
    font-weight: 600;
    border-radius: 30px;
    height: 56px;
`;

export default FishingLocation;
