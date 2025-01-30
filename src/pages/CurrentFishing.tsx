import FishingActions from '../components/containers/FishingActions';
import FishingLocation from '../components/containers/FishingLocation';
import DefaultLayout from '../components/layouts/DefaultLayout';
import LoaderComponent from '../components/other/LoaderComponent';
import { useCurrentFishing } from '../utils';

export const CurrentFishing = () => {
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();

  if (currentFishingLoading) {
    return <LoaderComponent />;
  }

  return (
    <DefaultLayout>
      {!currentFishing?.id ? <FishingLocation /> : <FishingActions fishing={currentFishing} />}
    </DefaultLayout>
  );
};

export default CurrentFishing;
