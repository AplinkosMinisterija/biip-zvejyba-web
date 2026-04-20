import { useRef } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FishingCard from '../components/cards/FishingCard';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Icon, { IconName } from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import { handleGetCaughtFishExcel, slugs, useInfinityLoad } from '../utils';
import api from '../utils/api';

const FishingJournal = () => {
  const navigate = useNavigate();
  const observerRef = useRef<any>(null);

  const { data, isFetching } = useInfinityLoad(
    'fishingJournal',
    api.getFishingJournal,
    observerRef,
  );

  const { isLoading: downloading, mutateAsync: handleDownload } = useMutation({
    mutationFn: () => handleGetCaughtFishExcel({}),
  });

  const fishings: any = data?.pages
    .flat()
    .map((item) => item?.rows)
    .flat();

  return (
    <DefaultLayout>
      <Container>
        <ExportButton onClick={() => handleDownload()} disabled={downloading}>
          <Icon name={downloading ? IconName.loader : IconName.excel} />
        </ExportButton>

        {fishings?.map((fishing: any) => {
          return (
            <FishingCard
              key={`fishing_${fishing.id}`}
              skipped={!!fishing?.skipEvent}
              startDate={fishing?.startEvent?.createdAt || fishing?.skipEvent?.createdAt}
              endDate={fishing?.endEvent?.createdAt || fishing?.skipEvent?.createdAt}
              fishOnBoat={fishing.weightEvents?.fishOnBoat}
              fishOnShore={fishing.weightEvents?.fishOnShore}
              onClick={() => {
                navigate(slugs.fishing(fishing.id));
              }}
              skipNote={fishing?.skipEvent?.data?.note}
            />
          );
        })}
        {observerRef && <Invisible ref={observerRef} />}
        {isFetching && <LoaderComponent />}
      </Container>
    </DefaultLayout>
  );
};

export default FishingJournal;
const Container = styled.div`
  width: 100%;
  display: block;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Invisible = styled.div`
  width: 10px;
  height: 16px;
`;

const ExportButton = styled.button`
  width: ${({ theme }) => theme.height?.buttons || 4}rem;
  height: ${({ theme }) => theme.height?.buttons || 4}rem;
  padding: ${({ theme }) => (theme.height?.buttons || 4) / 4}rem;
  background-color: white;
  color: #7b8b90;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
`;
