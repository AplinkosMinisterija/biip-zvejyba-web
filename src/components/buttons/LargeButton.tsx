import styled from 'styled-components';
import Button, { ButtonColors } from './Button';

enum Variant {
  FLORAL_WHITE = 'FLORAL_WHITE',
  GHOST_WHITE = 'GHOST_WHITE',
  AZURE = 'AZURE',
  HONEY_DEW = 'HONEY_DEW',
  ALICE_BLUE = 'ALICE_BLUE',
  GREY = 'GREY',
}

const LargeButton = ({ variant = Variant.GREY, title, subtitle, buttonLabel, onClick }: any) => {
  return (
    <Container $variant={variant} onClick={onClick}>
      <Title dangerouslySetInnerHTML={{ __html: title }} />
      <Row>
        <Subtitle>{subtitle}</Subtitle>
        <StyledButton variant={ButtonColors.TERTIARY}>{buttonLabel}</StyledButton>
      </Row>
    </Container>
  );
};

const Container = styled.div<{ $variant: Variant }>`
  padding: 20px;
  grid-template-columns: 1fr;
  gap: 0;
  background-image: url('/line.svg');
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  border-radius: 16px;
  background-color: ${({ theme, $variant }) => theme.colors.largeButton[$variant]};
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: start;
  justify-content: space-between;
`;

const Subtitle = styled.div``;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  align-items: center;
  margin-top: 12px;
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  height: 32px;
  padding: 0 16px;
`;

export default LargeButton;
