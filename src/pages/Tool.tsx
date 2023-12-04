import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ToolForm from '../components/forms/ToolForm';
import FormLayout from '../components/layouts/FormLayout';
import LoaderComponent from '../components/other/LoaderComponent';
import {
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  DeleteInfoProps,
  deleteTitles,
  handleErrorToastFromServer,
  slugs,
  ToolTypeType,
} from '../utils';
import api from '../utils/api';
import { useGetCurrentRoute } from '../utils/hooks';

export const Tool = () => {
  const currentRoute = useGetCurrentRoute();
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const { data: tool, isLoading } = useQuery(['tool', id], () => api.getTool(id), {
    onError: () => {
      navigate(slugs.tools);
    },
    enabled: !!id,
    retry: false,
  });

  const { mutateAsync: updateUserMutation, isLoading: updateLoading } = useMutation(
    ({ sealNr, toolType, type, ...rest }: any) =>
      api.updateTool({ sealNr, toolType: toolType?.id, data: rest }, id!),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
      onSuccess: async () => {
        navigate(slugs.tools);
      },
      retry: false,
    },
  );

  const { mutateAsync: deleteToolMutation } = useMutation(() => api.deleteTool(id!), {
    onError: () => {
      handleErrorToastFromServer();
    },
    onSuccess: async () => {
      navigate(slugs.tools);
    },
    retry: false,
  });

  const deleteInfo: DeleteInfoProps = {
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.delete,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.tool,
    deleteTitle: deleteTitles.tool,
    deleteName: tool?.toolType?.label,
    handleDelete: deleteToolMutation,
  };

  if (isLoading || !tool) {
    return <LoaderComponent />;
  }

  const { data } = tool;

  const initialValues = {
    type: tool?.toolType?.type || ToolTypeType.NET,
    toolType: tool?.toolType || null,
    sealNr: tool?.sealNr || null,
    eyeSize: data?.eyeSize,
    eyeSize2: data?.eyeSize2,
    eyeSize3: data?.eyeSize3,
    netLength: data?.netLength,
  };

  return (
    <FormLayout
      title={currentRoute?.title}
      infoTitle={tool?.toolType?.label}
      infoSubTitle={tool?.sealNr}
      back={currentRoute?.back}
      deleteInfo={deleteInfo}
    >
      <Container>
        <ToolForm
          onSubmit={updateUserMutation}
          initialValues={initialValues}
          isLoading={updateLoading}
        />
      </Container>
    </FormLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

export default Tool;
