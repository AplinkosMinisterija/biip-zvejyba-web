import styled from 'styled-components';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import { lt } from 'date-fns/locale';
const formatDuration = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) {
    return '';
  }
  const durationInMinutes = differenceInMinutes(new Date(endDate), new Date(startDate));
  const durationInHours = differenceInHours(new Date(endDate), new Date(startDate), {
    roundingMethod: 'floor',
  });
  if (!durationInHours) {
    return durationInMinutes + 'min.';
  }
  const minutes = durationInMinutes - durationInHours * 60;
  return durationInHours + 'val. ' + minutes + 'min.';
};
const FishingCard = ({ startDate, endDate }: any) => {
  const day = format(new Date(startDate), 'LLLL M', { locale: lt });
  const startHours = startDate ? format(new Date(startDate), 'hh:mm') : '';
  const endHours = endDate ? format(new Date(endDate), 'hh:mm') : 'Žvejojama';

  return (
    <Container $active={!endDate}>
      <Row>
        <CellLeft>{day}</CellLeft>
        <CellRight></CellRight>
      </Row>
      <MiddleRow>
        <Circle />
        <Line />
        <Time>
          <StyledImage src="/ship.svg" />
          {formatDuration(startDate, endDate)}
        </Time>
        <Line />
        <Circle />
      </MiddleRow>
      <Row>
        <CellLeft>{startHours}</CellLeft>
        <CellRight>{endHours}</CellRight>
      </Row>
    </Container>
  );
};
export default FishingCard;

const Container = styled.div<{ $active: boolean }>`
  width: 100%;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.largeButton.FLORAL_WHITE : theme.colors.cardBackground.pimary};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  color: grey;
  display: grid;
  text-decoration: none;
  gap: 12px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 14px;
`;

const MiddleRow = styled.div`
  display: grid;
  grid-template-columns: 10px 1fr auto 1fr 10px;
  align-items: center;
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid grey;
`;

const Line = styled.div`
  height: 2px;
  width: 100%;
  background-color: grey;
`;

const Time = styled.div`
  display: flex;
  margin: 0 8px;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  color: grey;
`;

const StyledImage = styled.img`
  width: 1.6rem;
  height: 1.6rem;
  fill: none;
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const CellLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;
const CellRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;
