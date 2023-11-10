import styled from 'styled-components';
import { BuiltTool, getBuiltToolInfo, theme } from '../../utils';
import Icon, { IconName } from '../other/Icon';
import Tag from './Tag';

const ToolsGroupCard = ({
  isEstuary,
  toolsGroup,
  selected,
  onSelect,
}: {
  isEstuary: boolean;
  toolsGroup: BuiltTool;
  selected?: boolean;
  onSelect: any;
}) => {
  const isCheckedTool = !!toolsGroup?.weightEvent;

  const { label, sealNr, locationName } = getBuiltToolInfo(toolsGroup);

  return (
    <Container $isCheckedTool={isCheckedTool}>
      <InnerContainer onClick={() => onSelect(toolsGroup)}>
        <IconContainer selected={isCheckedTool}>
          {isEstuary ? (
            <Estuary>{locationName.replace(/[^\d]/g, '')}</Estuary>
          ) : (
            <StyledIcon name={IconName.tools} $selected={selected!} />
          )}
        </IconContainer>
        <div>
          <ToolName>{label}</ToolName>
          {!isEstuary ? <SealNr>{`Telkinys: ${locationName} `}</SealNr> : ''}
          <SealNr>{sealNr}</SealNr>
        </div>
      </InnerContainer>
      {isCheckedTool && <Tag color={theme.colors.success} label={'Patikrintas'} />}
    </Container>
  );
};

const Container = styled.div<{ $isCheckedTool: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme, $isCheckedTool }) =>
    $isCheckedTool ? theme.colors.background.success : theme.colors.largeButton.GREY};
  border: 1px solid
    ${({ theme, $isCheckedTool }) => ($isCheckedTool ? theme.colors.success : 'transparent')};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  width: 100%;
  align-items: center;
  text-decoration: none;
  gap: 12px;
`;

const IconContainer = styled.div<{ selected: boolean }>`
  background-color: ${({ selected, theme }) => (selected ? theme.colors.success : 'white')};
  color: ${({ selected }) => (selected ? 'white' : theme.colors.text.secondary)};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIcon = styled(Icon)<{ $selected: boolean }>`
  fill: ${({ theme, $selected }) => ($selected ? 'white' : theme.colors.white)};
`;

const ToolName = styled.div`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2px;
`;

const SealNr = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Estuary = styled.div`
  display: flex;
  font-weight: 600;
`;

export default ToolsGroupCard;
