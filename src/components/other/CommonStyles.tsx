import styled from 'styled-components';
import { device } from '../../utils';

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 3.2rem;
  font-weight: 800;
`;

export const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 26px;
  margin-top: 4px;
  font-size: 1.6rem;
  margin-bottom: 32px;
`;

export const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 2}, 1fr);
  gap: 16px;
  margin: 16px 0;
  @media ${device.mobileL} {
    grid-template-columns: repeat(1, 1fr);
  }
`;
