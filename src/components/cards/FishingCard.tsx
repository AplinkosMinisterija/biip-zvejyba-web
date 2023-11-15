import styled from 'styled-components';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
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

const Months = [
  'Sausio',
  'Vasarion',
  'Kovo',
  'Balandžio',
  'Gegužės',
  'Birželio',
  'Liepos',
  'Rugpjūčio',
  'Rugsėjo',
  'Spalio',
  'Lapkričio',
  'Gruodžio',
];
const FishingCard = ({ startDate, endDate, onClick }: any) => {
  const month: string = format(new Date(startDate), 'M');
  const dayOfMonth = format(new Date(startDate), 'd');
  const day = `${Months[Number(month)]} ${dayOfMonth}d.`;

  const startHours = startDate ? format(new Date(startDate), 'hh:mm') : '';
  const endHours = endDate ? format(new Date(endDate), 'hh:mm') : 'Žvejojama';
  const active = !endDate;
  return (
    <Container $active={active} onClick={onClick}>
      <Row>
        <FishingDate>{day}</FishingDate>
        <FishingWeight></FishingWeight>
      </Row>
      <MiddleRow>
        <Circle $active={active} />
        <Line $active={active} />
        <Time>
          <StyledImage src="/ship.svg" />
          {formatDuration(startDate, endDate)}
        </Time>
        <Line $active={active} />
        <Circle $active={active} />
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
    $active ? theme.colors.largeButton.FLORAL_WHITE : theme.colors.largeButton.GREY};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  color: grey;
  display: grid;
  text-decoration: none;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const MiddleRow = styled.div`
  display: grid;
  grid-template-columns: 10px 1fr auto 1fr 10px;
  align-items: center;
  margin-top: 12px;
`;

const Circle = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.yellowDarker : theme.colors.greyDarker)};
`;

const Line = styled.div<{ $active: boolean }>`
  height: 2px;
  width: 100%;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.yellowDarker : theme.colors.greyDarker};
`;

const Time = styled.div`
  display: flex;
  margin: 0 8px;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledImage = styled.img`
  width: 1.6rem;
  height: 1.6rem;
  fill: none;
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: invert(33%) sepia(0%) saturate(783%) hue-rotate(206deg) brightness(88%) contrast(86%);
`;
const FishingDate = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FishingWeight = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CellLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
const CellRight = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
