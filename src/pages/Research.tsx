import NewResearch from '../components/containers/NewResearch';
import ResearchesList from '../components/containers/ResearchesList';
import UpdateResearch from '../components/containers/UpdateResearch';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { useGetCurrentRoute } from '../utils';
import { slugs } from '../utils/routes';
export const Research = () => {
  const currentRoute = useGetCurrentRoute();

  const renderContainer = () => {
    if (currentRoute?.slug === slugs.researches) return <ResearchesList />;

    if (currentRoute?.slug === slugs.newResearch) return <NewResearch />;
    if (currentRoute?.slug === slugs.updateResearch(':id')) return <UpdateResearch />;

    return <></>;
  };

  return (
    <DefaultLayout
      title={currentRoute?.title}
      subtitle={currentRoute?.subtitle}
      back={currentRoute?.back}
    >
      {renderContainer()}
    </DefaultLayout>
  );
};

export default Research;
