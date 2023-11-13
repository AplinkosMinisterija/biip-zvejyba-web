import { useQuery } from 'react-query';
import api from '../../utils/api';
import Button from '../buttons/Button';
import { Grid } from '../other/CommonStyles';
import LoaderComponent from '../other/LoaderComponent';
import ResearchCard from '../other/ResearchCard';

const Researches = () => {
  const { data = [], isLoading: researchLoading } = useQuery(['researches'], api.getResearches);

  if (researchLoading) return <LoaderComponent />;

  return (
    <Grid columns={1}>
      <ResearchCard
        research={{ waterBodyData: { name: 'test', municipality: 'lol', area: 22 } }}
        onClick={() => {}}
      />
      <Button onClick={() => {}}>{'Naujas mokslinis tyrimas'}</Button>
    </Grid>
  );
};

export default Researches;
