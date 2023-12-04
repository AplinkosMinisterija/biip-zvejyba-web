import format from 'date-fns/format';
import { useState } from 'react';
import styled from 'styled-components';
import { EventTypes, FishingEventLabels, theme } from '../../utils';
import FishingEventDetails from '../containers/FishingEventDetails';
import Popup from '../layouts/Popup';
import Icon, { IconName } from '../other/Icon';

const IconColors = {
  [EventTypes.START]: theme.colors.yellow,
  [EventTypes.END]: theme.colors.success,
  [EventTypes.SKIP]: theme.colors.yellow,
  [EventTypes.BUILD_TOOLS]: theme.colors.purpleBrighter,
  [EventTypes.REMOVE_TOOLS]: theme.colors.purpleBrighter,
  [EventTypes.WEIGHT_ON_SHORE]: theme.colors.primary,
  [EventTypes.WEIGHT_ON_BOAT]: theme.colors.primary,
};

const IconNames = {
  [EventTypes.START]: IconName.beginFishing,
  [EventTypes.END]: IconName.finishFishing,
  [EventTypes.SKIP]: IconName.beginFishing,
  [EventTypes.BUILD_TOOLS]: IconName.tools,
  [EventTypes.REMOVE_TOOLS]: IconName.tools,
  [EventTypes.WEIGHT_ON_SHORE]: IconName.fish,
  [EventTypes.WEIGHT_ON_BOAT]: IconName.fish,
};

const TimelineItem = ({ event, isLast }: any) => {
  const [showMore, setShowMore] = useState(false);

  const date = format(new Date(event.date), 'HH:mm');
  const location = event.location?.name;
  const type: EventTypes = event.type;
  const eventTools = event.data?.tools || event.data?.toolsGroup?.tools || [];
  const tools = eventTools.map((t: any) => t.sealNr).join(',');

  const weightTypeEvent = [EventTypes.WEIGHT_ON_BOAT, EventTypes.WEIGHT_ON_SHORE].some(
    (e) => e === type,
  );
  const weights: number[] = weightTypeEvent
    ? Object.values(event.data?.fish || event.data || {})
    : [];

  const sum = weights.reduce((partialSum: number = 0, val: number) => partialSum + val, 0);

  const weightLabel =
    type === EventTypes.WEIGHT_ON_BOAT
      ? `~${sum}kg`
      : type === EventTypes.WEIGHT_ON_SHORE
        ? `${sum}kg`
        : '';

  const showMoreButton = [
    EventTypes.BUILD_TOOLS,
    EventTypes.REMOVE_TOOLS,
    EventTypes.WEIGHT_ON_SHORE,
    EventTypes.WEIGHT_ON_BOAT,
  ].some((e) => e === type);

  return (
    <>
      <Container $isLast={isLast}>
        <ItemIcon $color={IconColors[type]}>
          <StyledImage name={IconNames[type]} />
        </ItemIcon>
        <ItemContent>
          <ItemLabel>
            {FishingEventLabels[type]}
            {weightLabel && <WeightLabel>{weightLabel}</WeightLabel>}
          </ItemLabel>
          <ItemDate>
            <div>{date}</div>
            {location && (
              <div>
                <StyledIcon name={IconName.locationOutline} />
                {location}
              </div>
            )}
            {tools && (
              <div>
                <StyledIcon name={IconName.tools} />
                {`${eventTools[0].toolType?.label}(${tools})`}
              </div>
            )}
          </ItemDate>
          {showMoreButton && (
            <MoreButton
              onClick={() => {
                setShowMore(true);
              }}
            >
              Plačiau
              <IconNext name={IconName.right} />
            </MoreButton>
          )}
        </ItemContent>
      </Container>
      <Popup visible={showMore} onClose={() => setShowMore(false)}>
        <FishingEventDetails event={event} />
      </Popup>
    </>
  );
};

export default TimelineItem;

const Container = styled.div<{ $isLast: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 8px;
  z-index: 2;
  position: relative;
  background-color: ${({ $isLast }) => ($isLast ? 'white' : 'transparent')};
`;

const ItemIcon = styled.div<{ $color: string }>`
  color: var(--white-color);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${({ $color }) => $color};
`;

const ItemContent = styled.div``;

const StyledImage = styled(Icon)`
  width: 1.6rem;
  height: 1.6rem;
  fill: none;
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: invert(100%) sepia(0%) saturate(2%) hue-rotate(223deg) brightness(109%) contrast(101%);
`;

const ItemLabel = styled.div`
  font-size: 1.8rem;
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 8px;
`;

const ItemDate = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 5px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
`;

const StyledIcon = styled(Icon)`
  margin-right: 4px;
  position: relative;
  top: 2px;
  height: 1.4rem;
  width: 1.4rem;
  filter: invert(28%) sepia(1%) saturate(0%) hue-rotate(138deg) brightness(104%) contrast(85%);
`;

const WeightLabel = styled.div`
  text-align: right;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const MoreButton = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  padding-top: 16px;
  cursor: pointer;
`;

const IconNext = styled(Icon)`
  font-size: 14px;
  margin-top: 3px;
`;
