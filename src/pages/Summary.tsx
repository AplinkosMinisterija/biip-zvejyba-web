import {
  DynamicFilter,
  FilterConfig,
  FilterInputTypes,
  Switch,
  useStorage,
} from '@aplinkosministerija/design-system';
import { useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Icon, { IconName } from '../components/other/Icon';
import {
  filtersTexts,
  getSummaryLocationScope,
  getSummaryZoneOptions,
  handleGetCatchSummaryExcel,
  LocationType,
  mapSummaryParams,
  SummaryFilterOptions,
  SummaryFilterValues,
  SummaryReportForm,
  summaryFilters,
  summaryTexts,
  useSummaryFilterOptions,
} from '../utils';

const onlyZone = (values: SummaryFilterValues, zone: LocationType) =>
  getSummaryLocationScope(values.types) === zone;

const filterConfig = ({
  bars,
  polders,
  fishTypes,
}: SummaryFilterOptions): Record<string, FilterConfig> => ({
  types: {
    label: summaryFilters.types,
    key: 'types',
    inputType: FilterInputTypes.multiselect,
    options: getSummaryZoneOptions(),
    customSetValue: (setFieldValue, value) => {
      setFieldValue('types', value);
      setFieldValue('bar', null);
      setFieldValue('polder', null);
    },
  },
  bar: {
    label: summaryFilters.bar,
    key: 'bar',
    inputType: FilterInputTypes.singleSelect,
    options: bars,
    optionLabel: (bar) => bar?.name,
    hidden: (values) => !onlyZone(values, LocationType.ESTUARY),
  },
  polder: {
    label: summaryFilters.polder,
    key: 'polder',
    inputType: FilterInputTypes.singleSelect,
    options: polders,
    optionLabel: (polder) => polder?.name,
    hidden: (values) => !onlyZone(values, LocationType.POLDERS),
  },
  fishTypes: {
    label: summaryFilters.fishTypes,
    key: 'fishTypes',
    inputType: FilterInputTypes.multiselect,
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
});

const rowConfig = [['types'], ['bar'], ['polder'], ['fishTypes'], ['createdFrom', 'createdTo']];

const Summary = () => {
  const filterOptions = useSummaryFilterOptions();
  const [report, setReport] = useState<SummaryReportForm>({ byMonths: false, byToolTypes: false });

  const { value: filters, setValue: setFilters } = useStorage<SummaryFilterValues>(
    'catch_summary_filters',
    {},
    true,
  );

  const { isLoading: downloading, mutateAsync: handleDownload } = useMutation({
    mutationFn: () => handleGetCatchSummaryExcel(mapSummaryParams(filters || {}, report)),
  });

  return (
    <DefaultLayout>
      <Container>
        <DynamicFilter
          filters={filters || {}}
          filterConfig={filterConfig(filterOptions)}
          rowConfig={rowConfig}
          onSetFilters={setFilters}
          disabled={downloading}
          texts={filtersTexts}
        />

        <ReportForm>
          <legend>{summaryTexts.reportForm}</legend>
          <Switch
            label={summaryTexts.byMonths}
            value={report.byMonths}
            disabled={downloading}
            onChange={(byMonths) => setReport({ ...report, byMonths })}
          />
          <Switch
            label={summaryTexts.byToolTypes}
            value={report.byToolTypes}
            disabled={downloading}
            onChange={(byToolTypes) => setReport({ ...report, byToolTypes })}
          />
        </ReportForm>

        <Description>{summaryTexts.description}</Description>
        <DownloadButton type="button" onClick={() => handleDownload()} disabled={downloading}>
          <Icon name={downloading ? IconName.loader : IconName.excel} />
          {downloading ? summaryTexts.preparing : summaryTexts.download}
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

const ReportForm = styled.fieldset`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin: 24px 0 0 0;
  padding: 16px 20px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;

  legend {
    padding: 0 4px;
    font-size: 1.6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.4rem;
  margin: 16px 0 0 0;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: ${({ theme }) => theme.height?.buttons || 4}rem;
  padding: 0 16px;
  margin-top: 16px;
  background-color: white;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
