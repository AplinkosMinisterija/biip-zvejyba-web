import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { handleAlert, slugs } from '../../utils';
import api from '../../utils/api';
import ResearchForm, { FormTypes, ResearchProps } from '../forms/ResearchForm';

const NewResearch = () => {
  const navigate = useNavigate();

  const initialValues: ResearchProps = {
    id: 0,
    cadastralId: '',
    formType: FormTypes.UETK,
    waterBodyData: {
      name: '',
      municipality: '',
      area: '',
    },
    startAt: undefined,
    endAt: undefined,
    predatoryFishesRelativeAbundance: '',
    predatoryFishesRelativeBiomass: '',
    averageWeight: '',
    valuableFishesRelativeBiomass: '',
    conditionIndex: '',
    files: [],
    previousResearchData: {
      year: '',
      conditionIndex: '',
      totalAbundance: '',
      totalBiomass: '',
    },
    fishes: [
      {
        fishType: undefined,
        abundance: '',
        abundancePercentage: '',
        biomass: '',
        biomassPercentage: '',
      },
    ],
  };

  const updateTokensMutation = useMutation(api.createResearch, {
    onError: ({ response }: any) => {
      handleAlert(response);
    },
    onSuccess: () => {
      navigate(slugs.researches);
    },
  });

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

  return <ResearchForm initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default NewResearch;
