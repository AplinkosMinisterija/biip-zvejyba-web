import { DynamicFilter, FilterInputTypes, useStorage } from '@aplinkosministerija/design-system';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Icon, { IconName } from '../components/other/Icon';
import {
  filtersTexts,
  formatDateFrom,
  formatDateTo,
  getLocationTypeOptions,
  handleGetCatchSummaryExcel,
  LocationType,
  Polder,
  summaryFilters,
  useFishTypes,
} from '../utils';
import api from '../utils/api';
import { FishType } from '../utils/types';

type SummaryFilterValues = {
  type?: { id: LocationType; label: string };
  location?: { id: string; name: string };
  fishTypes?: FishType[];
  createdFrom?: string;
  createdTo?: string;
};

const Summary = () => {
  const { fishTypes } = useFishTypes();

  // Abu sąrašai riboti ir serverio pusėje kešuojami, tad paimam vieną kartą —
  // SelectField ieško juose kliento pusėje.
  const { data: bars = [] } = useQuery(['bars'], () => api.getFishinSections(), { retry: false });
  const { data: polders = [] } = useQuery<Polder[]>(['polders'], () => api.getPolders(), {
    retry: false,
  });

  // Barų ir polderių id gali sutapti, todėl backend'as suderina id IR
  // pavadinimą — abu ir siunčiam.
  const locationOptions = useMemo(
    () => [
      ...(bars || []).map((bar: any) => ({ id: String(bar.id), name: bar.name })),
      ...(polders || []).map((polder: any) => ({ id: String(polder.id), name: polder.name })),
    ],
    [bars, polders],
  );

  const filterConfig = {
    type: {
      label: summaryFilters.type,
      key: 'type',
      inputType: FilterInputTypes.singleSelect,
      optionLabel: (option: { id: LocationType; label: string }) => option?.label,
      options: getLocationTypeOptions(),
    },
    location: {
      label: summaryFilters.location,
      key: 'location',
      inputType: FilterInputTypes.singleSelect,
      optionLabel: (item: { id: string; name: string }) => item?.name || '-',
      options: locationOptions,
    },
    fishTypes: {
      label: summaryFilters.fishTypes,
      key: 'fishTypes',
      inputType: FilterInputTypes.multiselect,
      optionLabel: (item: FishType) => item?.label || '-',
      options: fishTypes,
    },
    createdFrom: {
      label: summaryFilters.createdFrom,
      key: 'createdFrom',
      inputType: FilterInputTypes.date,
    },
    createdTo: {
      label: summaryFilters.createdTo,
      key: 'createdTo',
      inputType: FilterInputTypes.date,
    },
  };

  const rowConfig = [['type'], ['location'], ['fishTypes'], ['createdFrom', 'createdTo']];

  const mapFilters = (filters: SummaryFilterValues) => {
    const params: any = {};

    if (!filters) return params;

    if (filters.createdFrom) {
      params.dateFrom = formatDateFrom(new Date(filters.createdFrom)).toISOString();
    }

    if (filters.createdTo) {
      params.dateTo = formatDateTo(new Date(filters.createdTo)).toISOString();
    }

    if (filters.type?.id) {
      params.type = filters.type.id;
    }

    if (filters.location?.id) {
      params.locationId = filters.location.id;
      params.locationName = filters.location.name;
    }

    if (filters.fishTypes?.length) {
      params.fishTypes = filters.fishTypes.map((fishType) => fishType.id);
    }

    return params;
  };

  const { value: filters, setValue: setFilters } = useStorage<SummaryFilterValues>(
    'catch_summary_filters',
    {},
    true,
  );

  const { isLoading: downloading, mutateAsync: handleDownload } = useMutation({
    mutationFn: () => handleGetCatchSummaryExcel(mapFilters(filters)),
  });

  return (
    <DefaultLayout>
      <Container>
        <Row>
          <DynamicFilter
            filters={filters}
            filterConfig={filterConfig}
            rowConfig={rowConfig}
            onSetFilters={setFilters}
            disabled={downloading}
            texts={filtersTexts}
          />
        </Row>
        <Description>
          Atsisiųskite pasirinkto laikotarpio verslinės žvejybos sugavimų suvestinę. Duomenys
          sumuojami pagal įmonę, žuvų rūšį ir žvejybos zoną.
        </Description>
        <DownloadButton onClick={() => handleDownload()} disabled={downloading}>
          <Icon name={downloading ? IconName.loader : IconName.excel} />
          {downloading ? 'Ruošiama...' : 'Atsisiųsti suvestinę'}
        </DownloadButton>
      </Container>
    </DefaultLayout>
  );
};

export default Summary;

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

const Description = styled.p`
  color: #4b5563;
  font-size: 1.4rem;
  margin: 0 0 16px 0;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: ${({ theme }) => theme.height?.buttons || 4}rem;
  padding: 0 16px;
  background-color: white;
  color: #7b8b90;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
