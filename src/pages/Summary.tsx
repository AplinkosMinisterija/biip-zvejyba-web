import { useStorage } from '@aplinkosministerija/design-system';
import { useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import SwitchField from '../components/fields/SwitchField';
import SummaryFilterForm from '../components/forms/SummaryFilterForm';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Icon, { IconName } from '../components/other/Icon';
import {
  describeSummaryFilters,
  handleGetCatchSummaryExcel,
  mapSummaryParams,
  SummaryFilterValues,
  SummaryReportForm,
  summaryTexts,
  useSummaryFilterOptions,
} from '../utils';

const Summary = () => {
  const filterOptions = useSummaryFilterOptions();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [report, setReport] = useState<SummaryReportForm>({ byMonths: false, byToolTypes: false });

  const { value: filters, setValue: setFilters } = useStorage<SummaryFilterValues>(
    'catch_summary_filters',
    {},
    true,
  );

  const appliedFilters = describeSummaryFilters(filters || {});

  const { isLoading: downloading, mutateAsync: handleDownload } = useMutation({
    mutationFn: () => handleGetCatchSummaryExcel(mapSummaryParams(filters || {}, report)),
  });

  return (
    <DefaultLayout>
      <Container>
        <FilterButton type="button" onClick={() => setFiltersVisible(true)} disabled={downloading}>
          {summaryTexts.filters}
          <FilterCount aria-label={`Pritaikyta filtrų: ${appliedFilters.length}`}>
            {appliedFilters.length}
          </FilterCount>
        </FilterButton>
        {appliedFilters.length > 0 && <AppliedFilters>{appliedFilters.join(' · ')}</AppliedFilters>}

        <ReportForm>
          <legend>{summaryTexts.reportForm}</legend>
          <SwitchField
            label={summaryTexts.byMonths}
            value={report.byMonths}
            disabled={downloading}
            onChange={(byMonths) => setReport({ ...report, byMonths })}
          />
          <SwitchField
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

        <SummaryFilterForm
          visible={filtersVisible}
          values={filters || {}}
          options={filterOptions}
          onClose={() => setFiltersVisible(false)}
          onSubmit={(values) => {
            setFilters(values);
            setFiltersVisible(false);
          }}
        />
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

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: ${({ theme }) => theme.height?.buttons || 4}rem;
  padding: 0 16px;
  background-color: white;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1.6rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FilterCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1.3rem;
`;

const AppliedFilters = styled.p`
  margin: 12px 0 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.4rem;
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
