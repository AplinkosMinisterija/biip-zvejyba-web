import styled from 'styled-components';
import { EventTypes, theme } from '../../utils';
import format from 'date-fns/format';
import Icon, { IconName } from '../other/Icon';

const Labels = {
  [EventTypes.START]: 'Žvejybos pradžia',
  [EventTypes.END]: 'Baigta žvejyba',
  [EventTypes.SKIP]: 'Praleista žvejyba',
  [EventTypes.BUILD_TOOLS]: 'Patikrintas įrankis',
  [EventTypes.REMOVE_TOOLS]: 'Ištrauktas įrankis',
  [EventTypes.WEIGHT_ON_SHORE]: 'Tikslus svoris krante',
  [EventTypes.WEIGHT_ON_BOAT]: 'Patikrintas įrankis',
};

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
  const date = format(new Date(event.date), 'hh:mm');
  const location = event.location?.name;
  const type: EventTypes = event.type;
  const tools = event.data?.tools?.map((t: any) => t.sealNr).join(',');
  return (
    <Container $isLast={isLast}>
      <ItemIcon $color={IconColors[type] as string}>
        <StyledImage name={IconNames[type]} />
      </ItemIcon>
      <ItemContent>
        <ItemLabel>{Labels[type]}</ItemLabel>
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
              {`${event.data.tools[0].toolType?.label}(${tools})`}
            </div>
          )}
        </ItemDate>
      </ItemContent>
    </Container>
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
