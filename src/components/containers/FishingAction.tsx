import styled from 'styled-components';
import LargeButton from '../buttons/LargeButton';
import { Variant } from '../buttons/FishingLocationButton';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { slugs } from '../../utils/routes';

const FishingAction = ({ fishing }: any) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: finishFishing } = useMutation(api.finishFishing, {
    onError: () => {
      //TODO: display error
    },
    onSuccess: () => {
      //TODO: display success message
      queryClient.invalidateQueries('currentFishing');
    },
    retry: false,
  });

  const handleFinishFishing = () => {
    if (fishing?.id) {
      finishFishing(fishing.id);
    }
  };

  return (
    <>
      <Container>
        <LargeButton
          variant={Variant.FLORAL_WHITE}
          title="Tikrinkite arba</br>statykite įrankius"
          subtitle="Esate žvejybos vietoje"
          buttonLabel="Atidaryti"
          onClick={() => {
            const location = slugs.fishingTools(fishing?.id);
            navigate(location);
          }}
        />
        <LargeButton
          variant={Variant.GHOST_WHITE}
          title="Žuvies svoris</br>krante"
          subtitle="Pasverkite bendrą svorį"
          buttonLabel="Sverti"
          onClick={() => {
            const location = slugs.fishingWeight(fishing?.id);
            navigate(location);
          }}
        />
        <LargeButton
          variant={Variant.AZURE}
          title="Žvejybos baigimo</br>nustatymas"
          subtitle="Užbaikite žvejybą"
          buttonLabel="Baigti"
          onClick={handleFinishFishing}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-bottom: 40px;
`;

export default FishingAction;
