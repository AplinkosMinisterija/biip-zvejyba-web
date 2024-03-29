import styled from 'styled-components';
import Button, { ButtonColors } from './Button';

export enum Variant {
  FLORAL_WHITE = 'FLORAL_WHITE',
  GHOST_WHITE = 'GHOST_WHITE',
  AZURE = 'AZURE',
  HONEY_DEW = 'HONEY_DEW',
  ALICE_BLUE = 'ALICE_BLUE',
  GREY = 'GREY',
}

interface FishingLocationButtonProps {
  title: string;
  image: string;
  onClick: () => void;
  variant?: Variant;
  isDisabled?: boolean;
}

const FishingLocationButton = ({
  variant = Variant.GREY,
  title,
  image,
  onClick,
  isDisabled = false,
}: FishingLocationButtonProps) => {
  return (
    <Container $isDisabled={isDisabled} $variant={variant} onClick={() => !isDisabled && onClick()}>
      <Image src={image} />
      <Column>
        <Title>{title}</Title>
        <StyledButton disabled={isDisabled} variant={ButtonColors.TERTIARY}>
          Pasirinkti
        </StyledButton>
      </Column>
    </Container>
  );
};

FishingLocationButton.variant = Variant;

const Container = styled.div<{ $variant: Variant; $isDisabled: boolean }>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.largeButton[Variant.GREY]};
  border-radius: 16px;
  padding: 16px;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.6 : 1)};
  display: grid;
  grid-template-columns: 30% 1fr;
  align-items: center;
  gap: 24px;
  background-image: url('/line.svg');
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  border: 1px solid transparent;
  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const Image = styled.img`
  border-radius: 50%;
  width: 100%;
  aspect-ratio: 1/1;
  height: auto;
  object-fit: cover;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: start;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  font-size: 1.6rem;
`;

export default FishingLocationButton;
