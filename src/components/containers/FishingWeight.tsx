import styled from 'styled-components';

const FishingWeight = ({ fishing }: any) => {
  return (
    <>
      <Container>Fishing weight</Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-bottom: 40px;
`;

export default FishingWeight;
