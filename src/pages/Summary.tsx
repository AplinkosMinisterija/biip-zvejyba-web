import { DynamicFilter, FilterInputTypes, useStorage } from '@aplinkosministerija/design-system';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import DefaultLayout from '../components/layouts/DefaultLayout';
import {
  device,
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
        <DynamicFilter
          filters={filters}
          filterConfig={filterConfig}
          rowConfig={rowConfig}
          onSetFilters={setFilters}
          disabled={downloading}
          texts={filtersTexts}
        />
        <Description>
          Atsisiųskite pasirinkto laikotarpio verslinės žvejybos sugavimų suvestinę. Duomenys
          sumuojami pagal įmonę, žuvų rūšį ir žvejybos zoną.
        </Description>
        <Footer>
          <StyledButton
            onClick={() => handleDownload()}
            loading={downloading}
            disabled={downloading}
          >
            Atsisiųsti suvestinę
          </StyledButton>
        </Footer>
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

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.4rem;
  margin: 16px 0 0 0;
`;

const StyledButton = styled(Button)`
  width: 720px;
`;

const Footer = styled.div`
  display: flex;
  padding: 16px;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  @media ${device.desktop} {
    width: calc(100% - 320px);
    bottom: 16px;
  }
`;
