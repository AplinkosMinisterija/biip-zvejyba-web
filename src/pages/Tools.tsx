import { Form } from 'formik';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import ToolForm from '../components/forms/ToolForm';
import DefaultLayout from '../components/layouts/DefaultLayout';
import PopUpWithTitles from '../components/layouts/PopUpWithTitle';
import { ListContainer } from '../components/other/CommonStyles';
import LoaderComponent from '../components/other/LoaderComponent';
import ToolCard from '../components/other/ToolCard';
import { slugs } from '../utils';
import api from '../utils/api';
import { ToolTypeType } from '../utils/constants';
import { getCurrentRoute, handleAlert } from '../utils/functions';
import { buttonLabels, titles } from '../utils/texts';

const Tools = () => {
  const queryClient = useQueryClient();
  const [showPopup, setShowPopup] = useState(false);
  const currentRoute = getCurrentRoute(window.location.pathname);
  const navigate = useNavigate();

  const { data: tools, isLoading: toolsLoading } = useQuery(
    ['tools'],
    () => api.tools({ filter: {} }),
    {
      onError: () => {
        handleAlert();
      },
    },
  );

  const { mutateAsync: newToolMutation, isLoading } = useMutation(api.newTool, {
    onSuccess: () => {
      queryClient.invalidateQueries('tools');
      setShowPopup(false);
    },
    onError: () => {
      handleAlert();
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

  return (
    <>
      <DefaultLayout title={currentRoute?.title} subtitle={currentRoute?.subtitle}>
        <Container>
          {toolsLoading && <LoaderComponent />}
          <ListContainer>
            {tools?.map((tool: any) => (
              <ToolCard tool={tool} onClick={() => navigate(slugs.tool(tool.id))} />
            ))}
          </ListContainer>
          <Button onClick={() => setShowPopup(true)}>{buttonLabels.newTool}</Button>
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

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text.accent};
`;

export default Tools;
