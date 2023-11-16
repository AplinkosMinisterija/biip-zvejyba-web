import { map } from 'lodash';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { slugs } from '../../utils';
import api from '../../utils/api';
import Button from '../buttons/Button';
import { Grid } from '../other/CommonStyles';
import LoaderComponent from '../other/LoaderComponent';
import ResearchCard from '../other/ResearchCard';

const Researches = () => {
  const { data: researches, isLoading: researchLoading } = useQuery(
    ['researches'],
    api.getResearches,
    { retry: false },
  );
  const navigate = useNavigate();

  return (
    <Grid $columns={1}>
      <>
        {researchLoading ? (
          <LoaderComponent />
        ) : (
          map(researches?.rows, (research) => {
            return (
              <ResearchCard
                key={research?.id!}
                research={research}
                onClick={() => navigate(slugs.updateResearch(research.id!))}
              />
            );
          })
        )}

        <Button onClick={() => navigate(slugs.newResearch)}>{'Naujas mokslinis tyrimas'}</Button>
      </>
    </Grid>
  );
};

export default Researches;
