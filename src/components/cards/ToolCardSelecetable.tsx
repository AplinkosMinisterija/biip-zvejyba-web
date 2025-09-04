import styled from 'styled-components';
import { Tool } from '../../utils';
import Icon, { IconName } from '../other/Icon';
interface ToolCardSelectable {
  tool: Tool;
  onSelect: (toolId: number) => void;
  selected?: boolean;
}
const ToolCardSelectable = ({ tool, onSelect, selected = false }: ToolCardSelectable) => {
  return (
    <Container onClick={() => onSelect(tool.id)}>
      <IconContainer $selected={selected}>
        <StyledIcon name={selected ? IconName.check : IconName.home} $selected={selected} />
      </IconContainer>
      <div>
        <ToolName>{tool.toolType?.label ?? 'Įrankis'}</ToolName>
        <SealNr>{tool.sealNr}</SealNr>
      </div>
    </Container>
  );
};

const Container = styled.div`
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

const IconContainer = styled.div<{ $selected: boolean }>`
  background-color: ${({ $selected, theme }) => ($selected ? theme.colors.primary : 'white')};
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

export default ToolCardSelectable;
