import DefaultLayout from '../components/layouts/DefaultLayout';
import { slugs, useInfinityLoad } from '../utils';
import api from '../utils/api';
import LoaderComponent from '../components/other/LoaderComponent';
import FishingCard from '../components/cards/FishingCard';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const FishingJournal = () => {
  const navigate = useNavigate();
  const observerRef = useRef<any>(null);

  const { data, isFetching } = useInfinityLoad(
    'fishingJournal',
    api.getFishingJournal,
    observerRef,
  );

  const fishings: any = data?.pages
    .flat()
    .map((item) => item?.rows)
    .flat();

  return (
    <DefaultLayout>
      <Container>
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
