import { Form } from 'formik';
import { device, getLocationList, handleAlert, LocationType, theme } from '../../utils';
import AsyncSelectField from '../fields/AsyncSelect';
import { Footer, IconContainer } from '../other/CommonStyles';
import Button from '../buttons/Button';
import styled from 'styled-components';
import Icon, { IconName } from '../other/Icon';
import { useMutation } from 'react-query';
import api from '../../utils/api';
import { useState } from 'react';

const SelectWaterBody = ({ location, setLocation, onStartFishing }: any) => {
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
        <Heading>Kur žvejosite?</Heading>
        <TitleWrapper>
          {location?.name && (
            <>
              <LocationName>{`${location?.name} (${location?.municipality.name})`}</LocationName>
              <LocationId>{location?.id}</LocationId>
            </>
          )}
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
        />
      </Container>
      <Footer>
        <Button onClick={onStartFishing}>Pradėti žvejybą</Button>
      </Footer>
    </>
  );
};

export default SelectWaterBody;

const Container = styled.div`
  padding-top: 68px;
  border: 1px solid red;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const Heading = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  text-align: center;
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
