import { buttonLabels, getLocationList, handleAlert, LocationType, theme } from '../../utils';
import AsyncSelectField from '../fields/AsyncSelect';
import { Footer, Grid } from '../other/CommonStyles';
import Button from '../buttons/Button';
import styled from 'styled-components';
import { useMutation } from 'react-query';
import api from '../../utils/api';
import { useState } from 'react';
import LoaderComponent from '../other/LoaderComponent';

const SelectWaterBody = ({ location, setLocation, onStartFishing, loading }: any) => {
  const [value, setValue] = useState();
  const { mutateAsync: getLocationMutation } = useMutation(
    (coordinates: any) => {
      return api.getLocation({
        query: {
          type: LocationType.INLAND_WATERS,
          coordinates,
        },
      });
    },
    {
      onSuccess: (value) => {
        setLocation(value);
      },
      onError: () => {
        handleAlert();
      },
    },
  );

  const handleChangeValue = (value: any) => {
    setValue(value);
    setLocation({
      id: value.cadastralId,
      name: value.name,
      municipality: {
        name: value.municipality,
      },
    });
  };

  return (
    <>
      <Container>
        <TitleWrapper>
          {loading ? (
            <LoaderComponent />
          ) : location?.name ? (
            <>
              <LocationName>{`${location?.name} (${location?.municipality.name})`}</LocationName>
              <LocationId>{location?.id}</LocationId>
            </>
          ) : null}
        </TitleWrapper>
        <StyledSelectField
          name={'location'}
          value={value}
          label={'Pasirinkite vandens telkinį'}
          onChange={handleChangeValue}
          getOptionValue={(option) => option?.cadastralId}
          getInputLabel={(option) => option?.name}
          showError={false}
          getOptionLabel={(option) => {
            const { name } = option;
            return name;
          }}
          loadOptions={(input: string, page: number | string) => getLocationList(input, page, {})}
          inputValue={location?.name || ''}
        />
        <Grid $columns={1}>
          <Button loading={loading} disabled={loading} onClick={onStartFishing}>
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
