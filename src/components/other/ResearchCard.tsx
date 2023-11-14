import styled from 'styled-components';
import { formatDate, Research } from '../../utils';

const ResearchCard = ({
  research,
  onClick,
  key,
}: {
  research: Research;
  onClick: () => void;
  key: number;
}) => {
  const { waterBodyData, startAt, endAt, user } = research;

  const title = `${waterBodyData?.name} ${waterBodyData?.municipality}`;
  const date = `${formatDate(startAt)} - ${formatDate(endAt)}`;
  const userInitials = `${user?.firstName?.[0]}. ${user?.lastName}`;

  return (
    <Container key={`research-card-${key}`} onClick={onClick}>
      <Column>
        <Title>{title}</Title>
        <Row>
          <BottomLabel>{date}</BottomLabel>
          <BottomLabel>{userInitials}</BottomLabel>
        </Row>
      </Column>
    </Container>
  );
};

const Container = styled.a`
  cursor: pointer;
  border-radius: 12px;
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.largeButton.GREY};
  border: 1px solid ${({ theme }) => theme.colors.largeButton.GREY};

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.largeButton.FLORAL_WHITE};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: background-color: ${({ theme }) => theme.colors.text.primary};
`;

const BottomLabel = styled.div`
  font-size: 1.4rem;
  color: background-color: ${({ theme }) => theme.colors.text.secondary};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default ResearchCard;
