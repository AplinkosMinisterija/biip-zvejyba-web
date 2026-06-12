import { DynamicFilter, FilterInputTypes, useStorage } from '@aplinkosministerija/design-system';
import { useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FishingCard from '../components/cards/FishingCard';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Icon, { IconName } from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import {
  filtersTexts,
  FishingFilters,
  FishingLocationOption,
  formatDateFrom,
  formatDateTo,
  getLocationTypeOptions,
  handleGetCaughtFishExcel,
  journalTableFilters,
  LocationType,
  slugs,
  TenantUser,
  useGetCurrentProfile,
  useInfinityLoad,
} from '../utils';
import api from '../utils/api';

// Company-member options for the "Žvejys" filter. The list is the tenant's
// members (tenantUsers, user populated); companies have few employees, so a
// plain paginated list (no server-side name search) is enough.
const getCompanyUsersList = (_input: string, page: number) => api.getUsers({ page });

const FishingJournal = () => {
  // The "Žvejys" filter only makes sense under a company profile — a
  // freelancer has only their own fishings. A non-'personal' profile id is a
  // tenant (company). The backend allows a tenant member to narrow the journal
  // to a colleague (own-tenant scoped).
  const currentProfile = useGetCurrentProfile();
  const isCompany = !!currentProfile && currentProfile.id !== 'personal';

  // Locations that actually have fishings — fetched once (backend cached); the
  // SelectField searches them client-side, so no async select is needed.
  const { data: locationOptions = [] } = useQuery(['fishingLocations'], () =>
    api.getFishingLocations(),
  );

  const filterConfig = {
    type: {
      label: journalTableFilters.type,
      key: 'type',
      inputType: FilterInputTypes.singleSelect,
      optionLabel: (option: { id: LocationType; label: string }) => option?.label,
      options: getLocationTypeOptions(),
    },
    ...(isCompany && {
      person: {
        label: journalTableFilters.person,
        key: 'person',
        inputType: FilterInputTypes.asyncSingleSelect,
        optionLabel: (item: TenantUser) =>
          `${item?.user?.firstName || ''} ${item?.user?.lastName || ''}`.trim() || '-',
        optionsApi: getCompanyUsersList,
      },
    }),
    location: {
      label: journalTableFilters.location,
      key: 'location',
      inputType: FilterInputTypes.singleSelect,
      optionLabel: (item: FishingLocationOption) => item?.name || '-',
      options: locationOptions,
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

  const rowConfig = isCompany
    ? [['type'], ['person'], ['location'], ['createdFrom', 'createdTo']]
    : [['type'], ['location'], ['createdFrom', 'createdTo']];

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

      // Only meaningful for a company profile; the backend re-scopes this to
      // the caller's own tenant, so it can never cross companies.
      if (isCompany && filters.person?.user?.id) {
        params.user = filters.person.user.id;
      }

      // A location option maps to one of the two columns a fishing stores.
      if (filters.location) {
        if (filters.location.polder) {
          params.polderId = filters.location.id;
        } else {
          params.uetkCadastralId = String(filters.location.id);
        }
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
