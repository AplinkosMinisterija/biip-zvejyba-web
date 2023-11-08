import { map } from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import FishForm from '../components/forms/FishForm';
import FormLayout from '../components/layouts/FormLayout';
import LoaderComponent from '../components/other/LoaderComponent';
import { getBuiltToolInfo, handleAlert, slugs } from '../utils';
import api from '../utils/api';
import { useAppSelector, useFishTypes, useGetCurrentRoute } from '../utils/hooks';

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
      onError: () => {
        navigate(slugs.fishingTools(fishingId!));
      },
    },
  );

  const handleSubmit = (values: typeof initialValues) => {
    const data = values.reduce((obj: any, curr) => {
      if (Number(curr.amount)) {
        obj[curr.id] = curr.amount;
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
    amount: tool?.weighingEvent?.data?.[item?.id]! || '',
  }))!;

  return (
    <>
      <FormLayout
        title={currentRoute?.title}
        infoTitle={label}
        infoSubTitle={sealNr}
        back={currentRoute?.back}
      >
        <FishForm
          initialValues={initialValues}
          handleSubmit={handleSubmit}
          loading={weighToolsIsLoading}
        />
      </FormLayout>
    </>
  );
};

export default CaughtFishesWithTool;
