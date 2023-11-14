import DefaultLayout from '../components/layouts/DefaultLayout';
import { useGetCurrentRoute } from '../utils';
import { useInfiniteQuery } from 'react-query';
import api from '../utils/api';
import { useEffect } from 'react';
import LoaderComponent from '../components/other/LoaderComponent';
import FishingCard from '../components/cards/FishingCard';

const FishingJournal = () => {
  const currentRoute: any = useGetCurrentRoute();
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['fishingJournal'],
    queryFn: api.getFishingJournal,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    retry: false,
  });

  return (
    <DefaultLayout title={currentRoute.title}>
      {data?.pages?.map((page) => {
        return page?.map((fishing: any) => {
          return (
            <FishingCard
              key={`fishing_${fishing.id}`}
              startDate={fishing?.startEvent?.createdAt}
              endDate={fishing?.endEvent?.createdAt}
            />
          );
        });
      })}
      {isLoading && <LoaderComponent />}
    </DefaultLayout>
  );
};

export default FishingJournal;
