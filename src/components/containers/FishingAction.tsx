import styled from 'styled-components';
import LargeButton from '../buttons/LargeButton.tsx';
import { Variant } from '../buttons/FishingLocationButton.tsx';

const FishingAction = () => {
    return (
        <>
            <Container>
                <LargeButton
                    variant={Variant.FLORAL_WHITE}
                    title="Tikrinkite arba</br>statykite įrankius"
                    subtitle="Esate žvejybos vietoje"
                    buttonLabel="Atidaryti"
                />
                <LargeButton
                    variant={Variant.GHOST_WHITE}
                    title="Žuvies svoris</br>krante"
                    subtitle="Pasverkite bendrą svorį"
                    buttonLabel="Sverti"
                />
                <LargeButton
                    variant={Variant.AZURE}
                    title="Žvejybos baigimo</br>nustatymas"
                    subtitle="Užbaikite žvejybą"
                    buttonLabel="Baigti"
                />
            </Container>
        </>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export default FishingAction;
