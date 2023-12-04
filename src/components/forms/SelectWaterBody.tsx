import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { actions } from '../../state/fishing/reducer';
import { buttonLabels, getLocationList, useAppSelector, validationTexts } from '../../utils';
import Button from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelect';
import { Grid } from '../other/CommonStyles';
import LoaderComponent from '../other/LoaderComponent';

const SelectWaterBody = ({ onStartFishing, loading }: any) => {
  const location = useAppSelector((state) => state.fishing.location);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleChangeValue = (value: any) => {
    setError('');
    dispatch(actions.setLocation(value));
  };

  const handleSubmit = () => {
    if (!location) return setError(validationTexts.requireSelect);

    onStartFishing();
  };

  const getInputValue = (location: any) =>
    !!location ? `${location?.name}, ${location?.cadastralId}` : '';

  return (
    <>
      <Container>
        <TitleWrapper>
          {loading ? (
            <LoaderComponent />
          ) : location?.name ? (
            <>
              <LocationName>{`${location?.name}, ${location?.cadastralId} (${location?.municipality})`}</LocationName>
              <LocationId>{location?.id}</LocationId>
            </>
          ) : null}
        </TitleWrapper>
        <StyledSelectField
          name={'location'}
          value={location}
          label={'Pasirinkite vandens telkinį'}
          error={error}
          onChange={handleChangeValue}
          getOptionValue={(option) => option?.cadastralId}
          getOptionLabel={getInputValue}
          loadOptions={(input: string, page: number | string) => getLocationList(input, page, {})}
          inputValue={getInputValue(location)}
        />
        <Grid $columns={1}>
          <Button loading={loading} disabled={loading} onClick={handleSubmit}>
            {buttonLabels.startFishing}
          </Button>
        </Grid>
      </Container>
    </>
  );
};

export default SelectWaterBody;

const Container = styled.div`
  width: 100%;
`;

const LocationName = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
`;

const LocationId = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin: 16px 0;
`;

const StyledSelectField = styled(AsyncSelectField)`
  margin-bottom: 16px;
`;
