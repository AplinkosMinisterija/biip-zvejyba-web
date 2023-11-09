import { Form, Formik } from 'formik';
import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Button, { ButtonColors } from '../components/buttons/Button';
import BuildTools from '../components/containers/BuildTools';
import ToolActions from '../components/containers/ToolActions';
import AsyncSelectField from '../components/fields/AsyncSelect';
import NumericTextField from '../components/fields/NumericTextField';
import SelectField from '../components/fields/SelectField';
import FormLayout from '../components/layouts/FormLayout';
import Popup from '../components/layouts/Popup';
import PopUpWithImage from '../components/layouts/PopUpWithImage';
import { Grid } from '../components/other/CommonStyles';
import Icon, { IconName } from '../components/other/Icon';
import InfoWithImage from '../components/other/InfoWithImage';
import LoaderComponent from '../components/other/LoaderComponent';
import ToolsGroupCard from '../components/other/ToolsGroupCard';
import { RootState } from '../state/store';
import {
  getBars,
  getLocationList,
  handleAlert,
  inputLabels,
  locationSchema,
  useGetCurrentRoute,
} from '../utils';
import api from '../utils/api';
import { LocationType } from '../utils/constants';
import { device } from '../utils/theme';
import { ToolGroup } from '../utils/types';

const FishingTools = () => {
  const queryClient = useQueryClient();
  const coordinates = useSelector((state: RootState) => state.fishing.coordinates);
  const [showBuildTools, setShowBuildTools] = useState(false);
  const [showNotIdentifiedPopUp, setShowNotIdentifiedPopUp] = useState(false);
  const [showLocationPopUp, setShowLocationPopUp] = useState(false);
  const [selectedToolsGroup, setSelectedToolsGroup] = useState<ToolGroup | null>(null);
  const queryCache = queryClient.getQueryCache();
  const cachedLocation = queryCache.find(['location'])?.state?.data;
  const locationType: LocationType = (queryCache.find(['currentFishing'])?.state?.data as any)
    ?.type;
  const currentRoute = useGetCurrentRoute();
  const isEstuary = locationType === LocationType.ESTUARY;
  const {
    data: location,
    isLoading: locationLoading,
    isFetching: locationFetching,
  } = useQuery(['location'], () => getLocationMutation(coordinates), { enabled: !cachedLocation });

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

        queryClient.setQueryData('location', value);
      },
      onError: () => {
        handleAlert();
      },
    },
  );
  const handleRefreshLocation = () => {
    queryClient.invalidateQueries('location');
  };

  const { data: builtTools, isLoading: builtToolsLoading } = useQuery(
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
  const isLoading = [locationLoading, builtToolsLoading].some((loading) => loading);

  return (
    <FormLayout
      title={location?.name || 'Vieta nenustatyta'}
      onEdit={() => setShowLocationPopUp(true)}
      back={currentRoute?.back}
    >
      <Container>
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <>
            {location?.name && (
              <>
                {isEmpty(builtTools) ? (
                  <InfoWithImage
                    iconName={IconName.tools}
                    title={'Pastatykite įrankius'}
                    description={'Šioje vietoje nėra pastatytų įrankių'}
                  />
                ) : (
                  map(builtTools, (toolsGroup: any) => (
                    <ToolsGroupCard
                      isEstuary={isEstuary}
                      key={toolsGroup.id}
                      toolsGroup={toolsGroup}
                      onSelect={setSelectedToolsGroup}
                    />
                  ))
                )}
                <Footer>
                  <StyledButton onClick={() => setShowBuildTools(true)}>
                    Pastatyti įrankį
                  </StyledButton>
                </Footer>
              </>
            )}
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
                    label={inputLabels.location}
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
                      setFieldValue('location', { x: lng, y: lat, name });
                    }}
                    getOptionValue={(option) => option?.cadastralId}
                    getInputLabel={(option) => option?.name}
                    showError={false}
                    getOptionLabel={(option) => {
                      const { name } = option;
                      return name;
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
                    label={inputLabels.lng}
                    name="x"
                    value={values.x}
                    showError={false}
                    error={errors.x}
                    onChange={(email) => setFieldValue('x', email)}
                  />
                  <NumericTextField
                    label={inputLabels.lat}
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
    </FormLayout>
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
  font-size: 2.2rem;
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
  font-size: 1.7em;
`;

export default FishingTools;
