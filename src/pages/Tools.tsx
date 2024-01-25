import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import ToolCard from '../components/cards/ToolCard';
import ToolForm from '../components/forms/ToolForm';
import DefaultLayout from '../components/layouts/DefaultLayout';
import PopUpWithTitles from '../components/layouts/PopUpWithTitle';
import { Footer, ListContainer } from '../components/other/CommonStyles';
import LoaderComponent from '../components/other/LoaderComponent';
import { NotFound } from '../components/other/NotFound';
import { slugs, useGetCurrentRoute } from '../utils';
import api from '../utils/api';
import { ToolTypeType } from '../utils/constants';
import { handleErrorToastFromServer } from '../utils/functions';
import { buttonLabels, titles } from '../utils/texts';

const Tools = () => {
  const queryClient = useQueryClient();
  const [showPopup, setShowPopup] = useState(false);
  const currentRoute = useGetCurrentRoute();
  const navigate = useNavigate();

  const { data: tools, isLoading: toolsLoading } = useQuery(
    ['tools'],
    () => api.tools({ populate: ['toolType', 'toolsGroup'] }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
    },
  );

  const { mutateAsync: newToolMutation, isLoading } = useMutation(api.newTool, {
    onSuccess: () => {
      queryClient.invalidateQueries('tools');
      setShowPopup(false);
    },
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
  });

  const initialValues = {
    type: ToolTypeType.NET,
    toolType: null,
    sealNr: null,
    eyeSize: null,
    eyeSize2: null,
    eyeSize3: null,
    netLength: null,
  };
  const handleCreateNewTool = async (values: any) => {
    const { toolType, sealNr, ...rest } = values;
    await newToolMutation({
      toolType: toolType.id,
      sealNr,
      data: rest,
    });
  };

  if (toolsLoading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <DefaultLayout title={currentRoute?.title} subtitle={currentRoute?.subtitle}>
        <Container>
          {isEmpty(tools) ? (
            <NotFound message={'Nėra sukurtų įrankių sandelyje'} />
          ) : (
            <ListContainer>
              {map(tools, (tool: any) => (
                <ToolCard tool={tool} onClick={() => navigate(slugs.tool(tool.id))} />
              ))}
            </ListContainer>
          )}
          <Footer>
            <Button onClick={() => setShowPopup(true)}>{buttonLabels.newTool}</Button>
          </Footer>
        </Container>
      </DefaultLayout>
      <PopUpWithTitles
        title={titles.newTool}
        visible={showPopup}
        onClose={() => setShowPopup(false)}
      >
        <ToolForm
          onSubmit={handleCreateNewTool}
          initialValues={initialValues}
          isLoading={isLoading}
          isNew={true}
        />
      </PopUpWithTitles>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

export default Tools;
