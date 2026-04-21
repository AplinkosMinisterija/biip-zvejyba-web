import { DynamicFilter, FilterInputTypes, useStorage } from '@aplinkosministerija/design-system';
import { useRef } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FishingCard from '../components/cards/FishingCard';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Icon, { IconName } from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import {
  filtersTexts,
  FishingFilters,
  formatDateFrom,
  formatDateTo,
  getLocationTypeOptions,
  handleGetCaughtFishExcel,
  journalTableFilters,
  LocationType,
  slugs,
  useInfinityLoad,
} from '../utils';
import api from '../utils/api';

const FishingJournal = () => {
  const filterConfig = {
    type: {
      label: journalTableFilters.type,
      key: 'type',
      inputType: FilterInputTypes.singleSelect,
      optionLabel: (option: { id: LocationType; label: string }) => option?.label,
      options: getLocationTypeOptions(),
    },
    createdFrom: {
      label: journalTableFilters.createdFrom,
      key: 'createdFrom',
      inputType: FilterInputTypes.date,
    },
    createdTo: {
      label: journalTableFilters.createdTo,
      key: 'createdTo',
      inputType: FilterInputTypes.date,
    },
  };

  const rowConfig = [['type'], ['createdFrom', 'createdTo']];

  const mapFilters = (filters: FishingFilters) => {
    const params: any = {};

    if (filters) {
      (!!filters.createdFrom || !!filters.createdTo) &&
        (params.createdAt = {
          ...(filters.createdFrom && {
            $gte: formatDateFrom(new Date(filters.createdFrom)),
          }),
          ...(filters.createdTo && {
            $lt: formatDateTo(new Date(filters.createdTo)),
          }),
        });

      if (filters.type?.id) {
        params.type = filters.type?.id;
      }
    }

    return params;
  };

  const navigate = useNavigate();
  const observerRef = useRef<any>(null);

  const { value: filters, setValue: setFilters } = useStorage<FishingFilters>(
    `fishing_journal_filters`,
    {},
    true,
  );

  const { data, isFetching } = useInfinityLoad(
    `fishingJournal`,
    ({ page, ...filters }) => api.getFishingJournal({ page, query: mapFilters(filters) }),
    observerRef,
    filters,
  );

  const { isLoading: downloading, mutateAsync: handleDownload } = useMutation({
    mutationFn: () => handleGetCaughtFishExcel({ type: mapFilters(filters) }),
  });

  const fishings: any = data?.pages
    .flat()
    .map((item) => item?.rows)
    .flat();

  return (
    <DefaultLayout>
      <Container>
        <Row>
          <DynamicFilter
            filters={filters}
            filterConfig={filterConfig}
            rowConfig={rowConfig}
            onSetFilters={setFilters}
            disabled={isFetching}
            texts={filtersTexts}
          />
          <ExportButton onClick={() => handleDownload()} disabled={downloading}>
            <Icon name={downloading ? IconName.loader : IconName.excel} />
          </ExportButton>
        </Row>

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

const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
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
  cursor: pointer;
`;
