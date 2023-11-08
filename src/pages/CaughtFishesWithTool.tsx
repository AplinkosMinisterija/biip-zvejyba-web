import { Form, Formik } from 'formik';
import { map } from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import FormLayout from '../components/layouts/FormLayout';
import { Grid } from '../components/other/CommonStyles';
import FishRow from '../components/other/FishRow';
import Icon from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import { buttonLabels, getBuiltToolInfo, handleAlert, profileSchema, slugs } from '../utils';
import api from '../utils/api';
import { useAppSelector, useFishTypes, useGetCurrentRoute } from '../utils/hooks';

export interface UserProps {
  email?: string;
  phone?: string;
}

export const CaughtFishesWithTool = () => {
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, isLoading } = useFishTypes();
  const coordinates = useAppSelector((state) => state.fishing.coordinates);
  const { toolId, fishingId } = useParams();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const location = queryCache.find(['location'])?.state?.data;
  const navigate = useNavigate();

  const { data: tool, isLoading: toolLoading } = useQuery(
    ['builtTool', toolId],
    () => api.getBuiltTool(toolId!),
    {
      onError: () => {},
    },
  );

  const handleSubmit = (values: typeof initialValues) => {
    const data = values.reduce((obj: any, curr) => {
      if (Number(curr.value)) {
        obj[curr.id] = curr.value;
      }

      return obj;
    }, {});

    weighToolsMutation({ coordinates, location, data });
  };

  const { mutateAsync: weighToolsMutation, isLoading: weighToolsIsLoading } = useMutation(
    (data: any) => api.weighTools(data, toolId!),
    {
      onSuccess: () => {
        navigate(slugs.fishingTools(fishingId!));
      },
      onError: () => {
        handleAlert();
      },
    },
  );

  if (isLoading || toolLoading) return <LoaderComponent />;

  const { label, sealNr } = getBuiltToolInfo(tool!);

  const initialValues = map(fishTypes, (item) => ({
    ...item,
    value: tool?.weighingEvent?.data?.[item?.id]! || '',
  }))!;

  return (
    <>
      <FormLayout
        title={currentRoute?.title}
        infoTitle={label}
        infoSubTitle={sealNr}
        back={currentRoute?.back}
      >
        <Container>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validationSchema={profileSchema}
          >
            {({ values, setFieldValue }) => {
              return (
                <FormContainer>
                  <Grid columns={1}>
                    {values?.map((value, index) => (
                      <FishRow
                        fish={value}
                        onChange={(value) => setFieldValue(`${index}.value`, value)}
                      />
                    ))}
                    <Button
                      type="submit"
                      loading={weighToolsIsLoading}
                      disabled={weighToolsIsLoading}
                    >
                      {buttonLabels.saveChanges}
                    </Button>
                  </Grid>
                </FormContainer>
              );
            }}
          </Formik>
        </Container>
      </FormLayout>
    </>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2.4rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export default CaughtFishesWithTool;
