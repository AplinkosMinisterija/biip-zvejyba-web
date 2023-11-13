import ResearchForm, { FormTypes, ResearchProps } from '../forms/ResearchForm';

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

const NewResearch = () => {
  return (
    <ResearchForm
      initialValues={initialValues}
      onSubmit={(values: ResearchProps) => {
        console.log(values);
      }}
    />
  );
};

export default NewResearch;
