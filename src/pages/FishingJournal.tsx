import DefaultLayout from '../components/layouts/DefaultLayout';
import { slugs } from '../utils';
import { useInfiniteQuery } from 'react-query';
import api from '../utils/api';
import LoaderComponent from '../components/other/LoaderComponent';
import FishingCard from '../components/cards/FishingCard';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FishingJournal = () => {
  const navigate = useNavigate();

  const fetchFishings = async (page: number) => {
    const fishings = await api.getFishingJournal({ page });
    return {
      data: fishings.rows,
      page: fishings.page < fishings.totalPages ? fishings.page + 1 : undefined,
    };
  };

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    'fishingJournal',
    ({ pageParam }) => fetchFishings(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.page,
      cacheTime: 60000,
      retry: false,
    },
  );

  const handleScroll = async (e: any) => {
    const element = e.currentTarget;
    const isTheBottom =
      Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) <= 1;

    if (isTheBottom && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const fishings = data?.pages
    .flat()
    .map((item) => item?.data)
    .flat();

  return (
    <DefaultLayout onScroll={handleScroll}>
      <Container>
        {fishings?.map((fishing: any) => {
          return (
            <FishingCard
              key={`fishing_${fishing.id}`}
              startDate={fishing?.startEvent?.createdAt || fishing?.skipEvent?.createdAt}
              endDate={fishing?.endEvent?.createdAt || fishing?.skipEvent?.createdAt}
              fishOnBoat={fishing.weightEvents?.fishOnBoat}
              fishOnShore={fishing.weightEvents?.fishOnShore}
              onClick={() => {
                navigate(slugs.fishing(fishing.id));
              }}
            />
          );
        })}
        {isLoading && <LoaderComponent />}
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
