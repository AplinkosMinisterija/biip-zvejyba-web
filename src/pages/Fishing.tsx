import DefaultLayout from '../components/layouts/DefaultLayout';
import { useQuery } from 'react-query';
import api from '../utils/api';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import format from 'date-fns/format';
import TimeLineItem from '../components/cards/TimeLineItem';
import LoaderComponent from '../components/other/LoaderComponent';
export const CurrentFishing = () => {
  const { fishingId } = useParams();
  const { data, isLoading: currentFishingLoading } = useQuery(
    ['fishingHistory'],
    () => api.getFishingHistory({ id: fishingId }),
    {
      retry: false,
    },
  );
  const startDate = data?.history.find((e: any) => e.type === 'START').date;
  const date = startDate ? format(new Date(startDate), 'yyyy-MM-dd') : '-';
  const fullName = data?.user ? `${data.user.firstName} ${data.user.lastName}` : '-';
  const totalWeightEvent = data?.history.find((e: any) => e.type === 'WEIGHT_ON_SHORE');
  const weights: number[] = totalWeightEvent?.data ? Object.values(totalWeightEvent.data) : [];
  const sum = weights.reduce((partialSum: number = 0, val: number) => partialSum + val, 0);

  const total = sum ? `${sum}kg` : '-';

  return (
    <DefaultLayout>
      {currentFishingLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <FishingInfo>
            <FishingInfoCell>
              <InfoLabel>Data</InfoLabel>
              <div>{date}</div>
            </FishingInfoCell>
            <Divider />
            <FishingInfoCell>
              <InfoLabel>Tikslus svoris</InfoLabel>
              <div>{total}</div>
            </FishingInfoCell>
            <Divider />
            <FishingInfoCell>
              <InfoLabel>Grandininkas</InfoLabel>
              <div>{fullName}</div>
            </FishingInfoCell>
          </FishingInfo>
          <TimeLineContainer>
            <ConnectingLine />
            <InnerContainer>
              {data?.history?.map((event: any, index: number) => {
                return (
                  <TimeLineItem
                    key={`time_line_item_${index}`}
                    event={event}
                    isLast={index + 1 === data.history.length}
                  />
                );
              })}
            </InnerContainer>
          </TimeLineContainer>
        </>
      )}
    </DefaultLayout>
  );
};

export default CurrentFishing;

const FishingInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0 0 0;
  color: ${({ theme }) => theme.colors.text.primary};
  display: grid;
  grid-template-columns: 1fr 8px 1fr 8px 1fr;
  align-items: center;
  text-decoration: none;
  gap: 12px;
  width: 100%;
  text-align: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 50%;
  background-color: ${({ theme }) => theme.colors.greyDarker};
`;
const InfoLabel = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
const FishingInfoCell = styled.div``;

const TimeLineContainer = styled.div`
  position: relative;
  margin: 24px 0;
  width: 100%;
`;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ConnectingLine = styled.div`
  position: absolute;
  top: 0;
  left: 17px;
  transform: translateX(-2px);
  width: 1px;
  height: 100%;
  background-image: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.greyDarker},
    ${({ theme }) => theme.colors.greyDarker} 50%,
    transparent 50%,
    transparent 100%
  );
  background-size: 1px 12px;
`;
