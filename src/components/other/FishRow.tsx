import styled from 'styled-components';
import TextField from '../fields/TextField';
import React from 'react';

interface FishRowProp {
  onChange: (value: any) => void;
  fish: { label: string; photo: any; amount: number; preliminaryAmount?: number };
  index?: number;
}

const FishRow = React.memo(({ onChange, fish, index }: FishRowProp) => {
  const preventNumInputFromScrolling = (e: any) =>
    e.target.addEventListener(
      'wheel',
      function (e: any) {
        e.preventDefault();
      },
      { passive: false },
    );

  const { label, photo, amount, preliminaryAmount } = fish;

  return (
    <Row>
      <ImageContainer>
        <Image
          src={
            photo?.url
              ? photo?.url
              : 'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSFioPxAhwKJt3zlIkV4Q5Th0gkb5-428cZd0uPEjWoYn9Xkoi_L4C8kWaFu-KtqAvz'
          }
        />
      </ImageContainer>
      <Column>
        <TextColumn>
          <Title>{label.charAt(0).toUpperCase() + label.slice(1)}</Title>
          {preliminaryAmount && <Caught>{`Sugauta ${preliminaryAmount} kg`}</Caught>}
        </TextColumn>
        <InnerRow>
          <Button type="button" onClick={() => amount > 0 && onChange(amount - 1)}>
            -
          </Button>
          <StyledNumericTextField
            type="number"
            placeholder="0"
            name="personalCode"
            value={amount}
            onChange={(amount) => onChange(Number(amount))}
            pattern={/[0-9]+/}
            inputMode="numeric"
            onFocus={preventNumInputFromScrolling}
          />
          <Button type="button" onClick={() => onChange((amount || 0) + 1)}>
            +
          </Button>
        </InnerRow>
      </Column>
    </Row>
  );
});

const StyledNumericTextField = styled(TextField)`
  width: 100%;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 16px;
  margin: 32px 0;
  width: 100%;
`;

const InnerRow = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  gap: 16px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.div`
  font-size: 2.4rem;
  font-weight: 700;
`;

const Caught = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button`
  background-color: white;
  height: 56px;
  width: 56px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 2rem;
  font-weight: 600;
`;

const ImageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground.primary};
  display: flex;
  align-items: center;
  border-radius: 4px;
`;

const Image = styled.img`
  object-fit: contain;
  width: 88px;
  border-radius: 4px;
`;

export default FishRow;
