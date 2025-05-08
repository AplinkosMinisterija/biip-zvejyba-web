import format from 'date-fns/format';
import styled from 'styled-components';
import { EventTypes, FishingEventLabels, useFishTypes } from '../../utils';
import PreviewMap from '../other/PreviewMap';

const FishingEventDetails = ({ event }: any) => {
  const { fishTypes } = useFishTypes();

  const eventTools = event.data?.tools || event.data?.toolsGroup?.tools || [];
  const tools = eventTools.map((t: any) => t.sealNr).join(',');
  const date = event.date ? format(new Date(event.date), 'yyyy-MM-dd') : '-';

  const eventFish = event.data?.fish || event.data || {};
  const weightedFistTypes = Object.keys(eventFish);

  const isweightEvent = [EventTypes.WEIGHT_ON_SHORE, EventTypes.WEIGHT_ON_BOAT].some(
    (e) => e === event.type,
  );

  //TODO: should be converted to wgs
  const coordinates = event.coordinates ? `${event.coordinates.x?.toFixed(6)}, ${event.coordinates.y?.toFixed(6)}` : '-';

  return (
    <Container>
      <Title>{FishingEventLabels[event.type as EventTypes]}</Title>
      {tools && <Subtitle>{tools}</Subtitle>}
      <MapContainer>
        <PreviewMap value={event?.geom} height={'23rem'} />
      </MapContainer>
      <FishingInfo>
        <FishingInfoCell>
          <InfoLabel>Data</InfoLabel>
          <div>{date}</div>
        </FishingInfoCell>
        <Divider />
        <FishingInfoCell>
          <InfoLabel>Koordinatės</InfoLabel>
          <div>{coordinates}</div>
        </FishingInfoCell>
      </FishingInfo>
      {isweightEvent && (
        <FistWeightsList>
          {weightedFistTypes.map((fishTypeId) => {
            return (
              <FishWeightRow key={`fish_weight_row_${fishTypeId}`}>
                <div>{fishTypes?.find((f) => f.id === Number(fishTypeId))?.label || ''}</div>
                <div>{`${eventFish[fishTypeId]}kg`}</div>
              </FishWeightRow>
            );
          })}
        </FistWeightsList>
      )}
    </Container>
  );
};

export default FishingEventDetails;

const Container = styled.div`
  text-align: center;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  padding-top: 40px;
`;

const Title = styled.div`
  text-align: center;
  font-size: 2.4rem;
  font-weight: bold;
`;

const MapContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  margin-top: 16px;
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
`;

const FishingInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0 0 0;
  color: ${({ theme }) => theme.colors.text.primary};
  display: grid;
  grid-template-columns: 1fr 8px 2fr;
  align-items: center;
  text-decoration: none;
  gap: 12px;
  width: 100%;
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FishingInfoCell = styled.div``;

const Divider = styled.div`
  width: 1px;
  height: 50%;
  background-color: ${({ theme }) => theme.colors.greyDarker};
`;

const FistWeightsList = styled.ul`
  padding: 0 0 16px 0;
  margin: 0;
  list-style: none;
`;

const FishWeightRow = styled.li`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  padding: 16px 0;
  position: relative;
  font-size: 18px;
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.greyDarker},
      ${({ theme }) => theme.colors.greyDarker} 50%,
      transparent 50%,
      transparent 100%
    );
    background-size: 12px 1px;
  }
`;
