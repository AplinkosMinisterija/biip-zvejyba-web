import styled from 'styled-components';
import { theme } from '../../utils';

const Tag = ({ color = theme.colors.powder, label }: { color: string; label: string }) => {
  return <Container $color={color}>{label}</Container>;
};

const Container = styled.div<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  color: white;
  border-radius: 4px;
  height: 25px;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  margin-left: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Tag;
