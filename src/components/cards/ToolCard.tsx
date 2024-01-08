import styled from 'styled-components';
import { Tool } from '../../utils/types';
import Icon, { IconName } from '../other/Icon';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}
const ToolCard = ({ tool, onClick }: ToolCardProps) => {
  const isInWater = !!tool.toolsGroup && !tool.toolsGroup.removeEvent;
  const location = isInWater ? tool.toolsGroup?.buildEvent.location : undefined;

  const isEstuary = location?.name?.includes('baras');

  return (
    <Container onClick={onClick}>
      <IconContainer>
        {!isInWater && <StyledIcon name={IconName.home} />}
        {isEstuary && <BarNumber>{location?.name.replace(/[^\d]/g, '')}</BarNumber>}
        {isInWater && !isEstuary && <StyledIcon name={IconName.tools} />}
      </IconContainer>
      <div>
        <ToolName>{tool.toolType.label}</ToolName>
        <div>{tool.sealNr}</div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
  grid-template-columns: 48px 1fr;
  width: 100%;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.largeButton.GREY};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: grid;
  text-decoration: none;
  gap: 12px;
  border: 1px solid transparent;
  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;
const IconContainer = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIcon = styled(Icon)`
  //filter: invert(15%) sepia(56%) saturate(5078%) hue-rotate(226deg) brightness(92%) contrast(97%);
`;

const BarNumber = styled.div``;

const ToolName = styled.div`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2px;
`;

export default ToolCard;
