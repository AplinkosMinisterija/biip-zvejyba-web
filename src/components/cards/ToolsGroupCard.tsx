import styled from 'styled-components';
import { getBuiltToolInfo, theme, ToolsGroup } from '../../utils';
import Icon, { IconName } from '../other/Icon';
import Tag from '../other/Tag';
import ToolActionsPopup from '../containers/ToolActionsPopup';
import { useState } from 'react';

interface ToolsGroupCardProps {
  toolsGroup: ToolsGroup;
  onSelect: (toolsGroup?: ToolsGroup) => void;
  isEstuary?: boolean;
  selected?: boolean;
  isDisabled?: boolean;
}
const ToolsGroupCard = ({
  toolsGroup,
  onSelect,
  selected = false,
  isEstuary = false,
  isDisabled = false,
}: ToolsGroupCardProps) => {
  const isCheckedTool = !!toolsGroup?.weightEvent;
  const [visible, setVisible] = useState(false);

  const { label, sealNr, locationName } = getBuiltToolInfo(toolsGroup);

  return (
    <>
      <Container $isDisabled={isDisabled} $isCheckedTool={isCheckedTool}>
        <InnerContainer
          onClick={() => {
            if (!isDisabled) {
              onSelect(toolsGroup);
              setVisible(!visible);
            }
          }}
        >
          <IconContainer $selected={isCheckedTool}>
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
      <ToolActionsPopup
        location={location}
        visible={visible}
        toolGroup={toolsGroup}
        onReturn={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

const Container = styled.div<{ $isCheckedTool: boolean; $isDisabled: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme, $isCheckedTool }) =>
    $isCheckedTool ? theme.colors.cardBackground.success : theme.colors.largeButton.GREY};
  border: 1px solid
    ${({ theme, $isCheckedTool }) => ($isCheckedTool ? theme.colors.success : 'transparent')};
  border-radius: 12px;
  padding: 16px;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.6 : 1)};
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

const IconContainer = styled.div<{ $selected: boolean }>`
  background-color: ${({ $selected, theme }) => ($selected ? theme.colors.success : 'white')};
  color: ${({ $selected }) => ($selected ? 'white' : theme.colors.text.secondary)};
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
