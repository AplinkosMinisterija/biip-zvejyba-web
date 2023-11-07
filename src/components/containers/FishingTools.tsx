import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../state/store';
import { getBars, getLocationList, handleAlert, inputLabels, locationSchema } from '../../utils';
import api from '../../utils/api';
import { LocationType } from '../../utils/constants';
import { device } from '../../utils/theme';
import { ToolGroup } from '../../utils/types';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelect';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import Popup from '../layouts/Popup';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { Grid, IconContainer, Row } from '../other/CommonStyles';
import Icon, { IconName } from '../other/Icon';
import LoaderComponent from '../other/LoaderComponent';
import ToolsGroupCard from '../other/ToolsGroupCard';
import BuildTools from './BuildTools';
import ToolActions from './ToolActions';

const FishingTools = ({ fishing }: any) => {
  const locationType: LocationType = fishing.type;
  const queryClient = useQueryClient();
  const coordinates = useSelector((state: RootState) => state.fishing.coordinates);
  const [showBuildTools, setShowBuildTools] = useState(false);
  const [showNotIdentifiedPopUp, setShowNotIdentifiedPopUp] = useState(false);
  const [showLocationPopUp, setShowLocationPopUp] = useState(false);
  const [location, setLocation] = useState<any>();
  const [selectedToolsGroup, setSelectedToolsGroup] = useState<ToolGroup | null>(null);
  const isEstuary = locationType === LocationType.ESTUARY;

  const { isLoading: locationLoading, isFetching: locationFetching } = useQuery(
    ['location'],
    () => getLocationMutation(coordinates),
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: !location,
    },
  );

  const { data: bars } = useQuery(['bars'], async () => getBars(), {
    enabled: isEstuary,
  });

  const { mutateAsync: getLocationMutation } = useMutation(
    (coordinates: any) =>
      api.getLocation({
        query: {
          type: locationType,
          coordinates,
        },
      }),
    {
      onSuccess: (value) => {
        if (!value) return setShowNotIdentifiedPopUp(true);

        setLocation(value);
      },
      onError: () => {
        handleAlert();
      },
    },
  );
  const handleRefreshLocation = () => {
    queryClient.invalidateQueries('location');
  };

  const { data: builtTools } = useQuery(
    ['builtTools', location?.id],
    () => api.getBuiltTools({ locationId: location?.id }),

    {
      enabled: !!location?.id,
    },
  );

  const initialValues = { location: '', x: '', y: '' };
  const handleSetLocationManually = (values: any) => {
    const { location, x, y } = values;
    if (location) {
      getLocationMutation({ x: location.x, y: location.y });
    } else {
      getLocationMutation({ x, y });
    }

    setShowLocationPopUp(false);
  };

  return (
    <>
      <Container>
        {locationLoading ? (
          <LoaderComponent />
        ) : (
          <>
            <Row>
              <Title>{location?.name || 'Vieta nenustatyta'}</Title>
              <IconContainer onClick={() => setShowLocationPopUp(true)}>
                <EditIcon name={IconName.edit} />
              </IconContainer>
            </Row>
            {builtTools?.map((toolsGroup: any) => (
              <ToolsGroupCard
                key={toolsGroup.id}
                toolsGroup={toolsGroup}
                onSelect={setSelectedToolsGroup}
              />
            ))}
            <Footer>
              <StyledButton onClick={() => setShowBuildTools(true)}>Pastatyti įrankį</StyledButton>
            </Footer>
          </>
        )}
      </Container>
      <Popup visible={showBuildTools} onClose={() => setShowBuildTools(false)}>
        <BuildTools
          coordinates={coordinates}
          location={location}
          onClose={() => setShowBuildTools(false)}
        />
      </Popup>

      <PopUpWithImage
        visible={showNotIdentifiedPopUp}
        iconName={IconName.location}
        onClose={() => {
          setShowNotIdentifiedPopUp(false);
        }}
        title={'Nenustatytas vandens telkinys'}
        description={
          'Nepavyko nustatyti jūsų buvimo vietos. Nustatykite rankiniu būdu arba nuplaukite į žvejybos vietą ir atnaujinkite inofrmaciją.'
        }
      >
        <Grid>
          <Button
            disabled={locationFetching}
            onClick={() => {
              setShowNotIdentifiedPopUp(false);
              setShowLocationPopUp(true);
            }}
          >
            {'Nustatyti rankiniu būdu'}
          </Button>
          <Button
            loading={locationFetching}
            disabled={locationFetching}
            variant={ButtonColors.SECONDARY}
            onClick={handleRefreshLocation}
          >
            {'Atnaujinti informaciją'}
          </Button>
        </Grid>
      </PopUpWithImage>

      <PopUpWithImage
        visible={showLocationPopUp}
        onClose={() => setShowLocationPopUp(false)}
        title={'Esate kitur?'}
        description={
          'Prašome pasirinkti iš sąrašo telkinio pavadinimą/baro numerį arba įrašykite koordinates.'
        }
      >
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={handleSetLocationManually}
          validateOnChange={false}
          validationSchema={locationSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <FormContainer>
                {isEstuary ? (
                  <SelectField
                    options={bars}
                    getOptionLabel={(option) => option?.name}
                    value={values.location}
                    error={errors.location}
                    label={inputLabels.role}
                    name={'location'}
                    onChange={(value) => setFieldValue('location', value)}
                  />
                ) : (
                  <AsyncSelectField
                    name={'location'}
                    label={inputLabels.location}
                    value={values.location}
                    error={errors.location}
                    onChange={(value) => {
                      const { lat, lng, name } = value;
                      setFieldValue('location', { x: lat, y: lng, name });
                    }}
                    getOptionValue={(option) => option?.cadastralId}
                    getInputLabel={(option) => option?.name}
                    showError={false}
                    getOptionLabel={(option) => {
                      const { name, cadastralId, categoryTranslate } = option;
                      return `${name}, ${cadastralId}, ${categoryTranslate}`;
                    }}
                    loadOptions={(input: string, page: number | string) =>
                      getLocationList(input, page, {})
                    }
                  />
                )}

                <Or>
                  <Separator />
                  <SeparatorLabelContainer>
                    <SeparatorLabel>arba</SeparatorLabel>
                  </SeparatorLabelContainer>
                </Or>

                <Grid columns={2}>
                  <NumericTextField
                    label={inputLabels.lat}
                    name="x"
                    value={values.x}
                    showError={false}
                    error={errors.x}
                    onChange={(email) => setFieldValue('x', email)}
                  />
                  <NumericTextField
                    label={inputLabels.lng}
                    name="y"
                    value={values.y}
                    showError={false}
                    error={errors.y}
                    onChange={(email) => setFieldValue('y', email)}
                  />
                </Grid>
                <Grid>
                  <Button
                    type="button"
                    variant={ButtonColors.SECONDARY}
                    onClick={() => setShowLocationPopUp(false)}
                  >
                    {'Atšaukti'}
                  </Button>
                  <Button type="submit">{'Saugoti'}</Button>
                </Grid>
              </FormContainer>
            );
          }}
        </Formik>
      </PopUpWithImage>

      <ToolActions
        coordinates={coordinates}
        location={location}
        visible={!!selectedToolsGroup}
        toolGroup={selectedToolsGroup}
        onReturn={() => setSelectedToolsGroup(null)}
      />
    </>
  );
};

const Or = styled.div`
  width: 100%;
  position: relative;
`;

const SeparatorLabelContainer = styled.div`
  font: normal normal 600 16px/40px Manrope;
  color: #0b1f518f;
  position: absolute;
  width: 100%;
  text-align: center;
  opacity: 1;
`;

const SeparatorLabel = styled.span`
  font: normal normal 600 16px/40px Manrope;
  letter-spacing: 1.02px;
  color: #0b1f518f;
  background-color: white;
  padding: 0 8px;
  margin: 0 auto;
  vertical-align: middle;
  opacity: 1;
`;

const Separator = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: auto 0;
  position: absolute;
  width: 100%;
  margin: 24px 0;
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 3.2rem;
  font-weight: 800;
  text-align: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 28px;
  height: 56px;
  display: block;
  line-height: 56px;
  font-size: 20px;
  font-weight: 600;
  padding: 0;
`;

const Footer = styled.div`
  display: block;
  position: sticky;
  bottom: 0;
  cursor: pointer;
  padding: 16px 0;
  text-decoration: none;
  width: 100%;
  background-color: white;
  @media ${device.desktop} {
    padding: 16px 0 0 0;
  }
`;

const EditIcon = styled(Icon)`
  font-size: 3.3rem;
`;

export default FishingTools;
