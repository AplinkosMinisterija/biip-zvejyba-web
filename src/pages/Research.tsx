import NewResearch from '../components/containers/NewResearch';
import ResearchesList from '../components/containers/ResearchesList';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { useGetCurrentRoute } from '../utils';
import { slugs } from '../utils/routes';
export const Research = () => {
  const currentRoute = useGetCurrentRoute();

  const renderContainer = () => {
    if (currentRoute?.slug === slugs.researches) return <ResearchesList />;

    return <></>;
  };

  return (
    <DefaultLayout
      title={currentRoute?.title}
      subtitle={currentRoute?.subtitle}
      back={currentRoute?.back}
    >
      <NewResearch />
    </DefaultLayout>
  );
};

export default Research;
