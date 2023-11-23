import styled from 'styled-components';
import { device } from '../../utils';

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 3.2rem;
  font-weight: 800;
`;

export const FormTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 800;
  width: 100%;
  text-align: center;
`;

export const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 26px;
  margin-top: 4px;
  font-size: 1.6rem;
  margin-bottom: 32px;
`;

export const Grid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 16px;
  margin: 16px 0;
  width: 100%;
  @media ${device.mobileL} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 40px;
`;

export const SpaceBetweenFlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const InfoContainer = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InfoTitle = styled.div`
  font-size: 2.4rem;
  font-weight: 600;
`;

export const InfoSubTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.grey};
  font-size: 1.6rem;
  margin-bottom: 32px;
`;
export const IconContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

export const Footer = styled.div`
  display: block;
  position: sticky;
  bottom: 0;
  cursor: pointer;
  padding: 16px 0;
  text-decoration: none;
  width: 100%;
  background-color: white;
  @media ${device.desktop} {
    padding: 16px 0 0 0;
  }
`;
