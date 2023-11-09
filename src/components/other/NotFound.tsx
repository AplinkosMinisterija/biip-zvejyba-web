import styled from 'styled-components';
import { device } from '../../utils';

export const NotFound = ({ message }: { message: string }) => {
  return <Container>{message}</Container>;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  @media ${device.mobileL} {
    width: 100%;
  }
`;
