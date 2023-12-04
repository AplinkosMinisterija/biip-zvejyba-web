import { differenceInMinutes, format } from 'date-fns';
import styled from 'styled-components';
import Icon, { IconName } from '../other/Icon';
const formatDuration = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) {
    return '';
  }
  const durationInMinutes = differenceInMinutes(new Date(endDate), new Date(startDate), {
    roundingMethod: 'ceil',
  });
  const durationInHours = Math.floor(durationInMinutes / 60);
  if (!durationInHours) {
    return durationInMinutes + 'min.';
  }
  const minutes = durationInMinutes - durationInHours * 60;
  return durationInHours + 'val. ' + minutes + 'min.';
};

const Months = [
  'Sausio',
  'Vasario',
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

const getWeightString = (fishOnBoat: any, fishOnShore: any) => {
  if (!fishOnShore && !fishOnBoat) {
    return '';
  }
  if (fishOnShore) {
    const weightOnShore =
      Object.values(fishOnShore.data)
        .flat()
        .reduce((acc: any, current: any) => acc + current, 0) || '';
    return weightOnShore ? `${weightOnShore}kg` : '';
  }
  const weightOnBoat =
    Object.values(fishOnBoat || {})
      ?.map((e: any) => Object.values(e.data))
      .flat()
      .reduce((acc: any, current: any) => acc + current, 0) || '';
  return weightOnBoat ? `~${weightOnBoat}kg` : '';
};

const FishingCard = ({ startDate, endDate, fishOnBoat, fishOnShore, skipped, onClick }: any) => {
  const month: string = startDate ? format(new Date(startDate), 'M') : '';
  const dayOfMonth = startDate ? format(new Date(startDate), 'd') : '';

  const day = `${Months[Number(month) - 1]} ${dayOfMonth}d.`;

  const startHours = startDate ? format(new Date(startDate), 'HH:mm') : '';
  const endHours = endDate ? format(new Date(endDate), 'HH:mm') : 'Žvejojama';
  const active = !endDate && startDate;

  const weight = getWeightString(fishOnBoat, fishOnShore);

  return (
    <Container $active={active} onClick={onClick}>
      <Row>
        <FishingDate>{day}</FishingDate>
        {weight && (
          <FishingWeight>
            <Icon name={IconName.fish} />
            {weight}
          </FishingWeight>
        )}
      </Row>
      <MiddleRow>
        <Circle $active={active} />
        <Line $active={active} />
        <Time>
          <StyledImage src={skipped ? '/ship_crossed_out.svg' : '/ship.svg'} />
          {!skipped ? formatDuration(startDate, endDate) : ''}
        </Time>
        <Line $active={active} />
        <Circle $active={active} />
      </MiddleRow>

      <Row>
        {startDate && <CellLeft>{startHours}</CellLeft>}
        {endDate && <CellRight>{endHours}</CellRight>}
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
  cursor: pointer;
  border: 1px solid transparent;
  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
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
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
  gap: 4px;
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
