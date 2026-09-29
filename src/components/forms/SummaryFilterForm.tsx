import { DatePicker, MultiSelectField, SelectField } from '@aplinkosministerija/design-system';
import { Form, Formik } from 'formik';
import styled from 'styled-components';
import {
  filtersTexts,
  getSummaryLocationScope,
  getSummaryZoneOptions,
  LocationType,
  SummaryFilterOptions,
  SummaryFilterValues,
  SummaryLabeledOption,
  SummaryLocation,
  SummaryZoneOption,
  summaryFilters,
  summaryTexts,
} from '../../utils';
import Button from '../buttons/Button';
import Popup from '../layouts/Popup';

interface SummaryFilterFormProps {
  visible: boolean;
  values: SummaryFilterValues;
  options: SummaryFilterOptions;
  onSubmit: (values: SummaryFilterValues) => void;
  onClose: () => void;
}

interface LocationFieldProps {
  values: SummaryFilterValues;
  options: SummaryFilterOptions;
  onChange: (location: SummaryLocation | null) => void;
}

const optionLabel = (option: SummaryLabeledOption) => option.label;

const LocationField = ({ values, options, onChange }: LocationFieldProps) => {
  const scope = getSummaryLocationScope(values.types);

  if (!scope) {
    return (values.types?.length ?? 0) > 1 ? <Hint>{summaryFilters.locationHidden}</Hint> : null;
  }

  const isEstuary = scope === LocationType.ESTUARY;

  return (
    <SelectField
      label={isEstuary ? summaryFilters.bar : summaryFilters.polder}
      value={values.location}
      options={isEstuary ? options.bars : options.polders}
      getOptionLabel={(option: SummaryLocation) => option.name}
      placeholder={summaryFilters.allLocations}
      clearable
      onChange={onChange}
    />
  );
};

const SummaryFilterForm = ({
  visible,
  values,
  options,
  onSubmit,
  onClose,
}: SummaryFilterFormProps) => (
  <Popup visible={visible} onClose={onClose}>
    <Formik<SummaryFilterValues> initialValues={values} enableReinitialize onSubmit={onSubmit}>
      {({ values, setFieldValue }) => (
        <StyledForm>
          <Title>{summaryTexts.filters}</Title>
          <MultiSelectField
            label={summaryFilters.types}
            values={values.types || []}
            options={getSummaryZoneOptions()}
            getOptionLabel={(option: SummaryZoneOption) => option.label}
            onChange={(types: SummaryZoneOption[]) => {
              setFieldValue('types', types);
              setFieldValue('location', null);
            }}
          />
          <LocationField
            values={values}
            options={options}
            onChange={(location) => setFieldValue('location', location)}
          />
          <MultiSelectField
            label={summaryFilters.fishTypes}
            values={values.fishTypes || []}
            options={options.fishTypes}
            getOptionLabel={optionLabel}
            onChange={(fishTypes: SummaryLabeledOption[]) => setFieldValue('fishTypes', fishTypes)}
          />
          <Dates>
            <DatePicker
              label={summaryFilters.createdFrom}
              value={values.createdFrom}
              maxDate={values.createdTo}
              onChange={(date?: Date) => setFieldValue('createdFrom', date)}
            />
            <DatePicker
              label={summaryFilters.createdTo}
              value={values.createdTo}
              minDate={values.createdFrom}
              onChange={(date?: Date) => setFieldValue('createdTo', date)}
            />
          </Dates>
          <Actions>
            <ClearButton type="button" onClick={() => onSubmit({})}>
              {filtersTexts.clearAll}
            </ClearButton>
            <SubmitWrapper>
              <Button type="submit" height={44}>
                {filtersTexts.filter}
              </Button>
            </SubmitWrapper>
          </Actions>
        </StyledForm>
      )}
    </Formik>
  </Popup>
);

export default SummaryFilterForm;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: min(500px, 100%);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 2.4rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Hint = styled.p`
  margin: 0;
  padding: 12px 16px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.4rem;
`;

const Dates = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
`;

const SubmitWrapper = styled.div`
  width: 160px;
`;

const ClearButton = styled.button`
  white-space: nowrap;
  background: none;
  border: none;
  padding: 0;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;
`;
