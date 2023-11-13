import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { handleAlert, slugs } from '../../utils';
import api from '../../utils/api';
import ResearchForm, { FormTypes, ResearchProps } from '../forms/ResearchForm';
import LoaderComponent from '../other/LoaderComponent';

const UpdateResearch = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: research, isLoading: researchLoading } = useQuery(
    ['research', id],
    () => api.getResearch(id!),
    {},
  );

  const updateTokensMutation = useMutation((values: any) => api.updateResearch(values, id!), {
    onError: ({ response }: any) => {
      handleAlert(response);
    },
    onSuccess: () => {
      navigate(slugs.researches);
    },
  });

  const initialValues = {
    ...research,
    formType: !!research?.previousResearchData ? FormTypes.NOT_UETK : FormTypes.UETK,
  };

  const handleSubmit = (values: ResearchProps) => {
    const { formType, cadastralId, previousResearchData, geom, ...rest } = values;
    const isUetkFormType = values.formType === FormTypes.UETK;
    const params = {
      ...rest,
      ...(!!isUetkFormType && { cadastralId }),
      ...(!isUetkFormType && { previousResearchData, geom }),
      fishes: rest.fishes?.map((fish) => {
        return {
          ...fish,
          fishType: fish.fishType?.id,
        };
      }),
    };
    updateTokensMutation.mutateAsync(params);
  };

  if (researchLoading) return <LoaderComponent />;

  return (
    <ResearchForm initialValues={initialValues!} onSubmit={handleSubmit} disableMainFields={true} />
  );
};

export default UpdateResearch;
