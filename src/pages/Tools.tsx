import DefaultLayout from '../components/layouts/DefaultLayout';
import { getCurrentRoute, handleUpdateTokens } from '../utils/functions';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import ToolTypeButton from '../components/buttons/ToolTypeButton';
import Popup from '../components/layouts/Popup';
import { useState } from 'react';
import { Form, Formik } from 'formik';
import { ToolType } from '../utils/constants';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../utils/api';
import SelectField from '../components/fields/SelectField';
import TextField from '../components/fields/TextField';
import * as Yup from 'yup';
import { validationTexts } from '../utils/texts.ts';
import ToolCard from '../components/other/ToolCard.tsx';
import LoaderComponent from '../components/other/LoaderComponent.tsx';

const validateSpecies = (toolType: any) =>
    Yup.object().shape({
        sealNr: Yup.string().required(validationTexts.requireText),
        toolType: Yup.object().required(validationTexts.requireText),
        eyeSize: Yup.number().required(validationTexts.requireText),
        eyeSize2: Yup.number().when([], (values, schema) => {
            if (toolType === ToolType.CATCHER) {
                return schema.required(validationTexts.requireText);
            }
            return schema.nullable();
        }),
        netLength: Yup.number().when([], (values, schema) => {
            if (toolType === ToolType.NET) {
                return schema.required(validationTexts.requireText);
            }
            return schema.nullable();
        }),
    });

const Tools = () => {
    const queryClient = useQueryClient();
    const [showPopup, setShowPopup] = useState(false);
    const currentRoute = getCurrentRoute(window.location.pathname);
    const [toolType, setToolType] = useState(ToolType.NET);

    const { data: toolTypes } = useQuery(
        ['toolTypes', toolType],
        () => api.toolTypes({ filter: { type: toolType } }),
        {
            onError: () => {},
        }
    );

    const { data: tools, isLoading: toolsLoading } = useQuery(
        ['tools'],
        () => api.tools({ filter: { type: toolType } }),
        {
            onError: () => {},
        }
    );

    const { mutateAsync: newToolMutation, isLoading } = useMutation(api.newTool, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('tools');
            setShowPopup(false);
        },
        onError: ({ response }: any) => {},
    });

    const initialValues = {
        toolType: toolTypes?.[0],
        sealNr: null,
        eyeSize: null,
        eyeSize2: null,
        netLength: null,
    };
    const handleCreateNewTool = async (values: any) => {
        await newToolMutation({
            ...values,
            toolType: values.toolType.id,
        });
    };

    const preventNumInputFromScrolling = (e: any) =>
        e.target.addEventListener(
            'wheel',
            function (e: any) {
                e.preventDefault();
            },
            { passive: false }
        );

    return (
        <>
            <DefaultLayout
                title={currentRoute?.title}
                subtitle={currentRoute?.subtitle}
                footer={
                    <Footer>
                        <StyledButton onClick={() => setShowPopup(true)}>
                            Naujas įrankis
                        </StyledButton>
                    </Footer>
                }
            >
                <Container>
                    {toolsLoading && <LoaderComponent />}
                    {tools?.map((tool: any) => <ToolCard tool={tool} />)}
                </Container>
            </DefaultLayout>
            <Popup visible={showPopup} onClose={() => setShowPopup(false)}>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={handleCreateNewTool}
                    validateOnChange={false}
                    validationSchema={validateSpecies(toolType)}
                >
                    {({ values, errors, setFieldValue, resetForm }: any) => {
                        return (
                            <FormContainer>
                                <FormTitle>Naujas įrankis</FormTitle>
                                <ButtonsContainer>
                                    <ToolTypeButton
                                        label="Tinklas"
                                        icon="/net.svg"
                                        onClick={() => {
                                            setToolType(ToolType.NET);
                                            resetForm();
                                        }}
                                        active={toolType === ToolType.NET}
                                    />
                                    <ToolTypeButton
                                        label="Gaudyklė"
                                        icon="/catcher.svg"
                                        onClick={() => {
                                            setToolType(ToolType.CATCHER);
                                            resetForm();
                                        }}
                                        active={toolType === ToolType.CATCHER}
                                    />
                                </ButtonsContainer>
                                <Wrapper>
                                    <TextField
                                        label="Plombos Nr."
                                        name="sealNr"
                                        value={values.sealNr || ''}
                                        error={errors.sealNr}
                                        onChange={(e) => setFieldValue('sealNr', e)}
                                        height={56}
                                        type="number"
                                        onFocus={preventNumInputFromScrolling}
                                    />
                                    <SelectField
                                        label={
                                            toolType === ToolType.NET
                                                ? 'Tinklo tipas'
                                                : 'Gaudyklės tipas'
                                        }
                                        name="toolType"
                                        options={toolTypes}
                                        value={values.toolType}
                                        onChange={(e) => setFieldValue('toolType', e)}
                                        getOptionLabel={(option) => option.label}
                                        error={errors.toolType}
                                        height={56}
                                    />
                                    {toolType === ToolType.CATCHER && (
                                        <SectionTitle>Gaudyklės akių dydis</SectionTitle>
                                    )}
                                    <TextField
                                        label={
                                            toolType === ToolType.NET
                                                ? 'Akių dydis, mm'
                                                : 'Sparnuose, mm'
                                        }
                                        name="eyeSize"
                                        value={values.eyeSize || ''}
                                        error={errors.eyeSize}
                                        height={56}
                                        onChange={(e) => setFieldValue('eyeSize', Number(e))}
                                        type="number"
                                        onFocus={preventNumInputFromScrolling}
                                    />
                                    {toolType === ToolType.CATCHER && (
                                        <TextField
                                            label="Jungiamoje dalyje, mm"
                                            name="eyeSize2"
                                            value={values.eyeSize2 || ''}
                                            error={errors.eyeSize2}
                                            height={56}
                                            onChange={(e) => setFieldValue('eyeSize2', Number(e))}
                                            type="number"
                                            onFocus={preventNumInputFromScrolling}
                                        />
                                    )}
                                    {toolType === ToolType.NET && (
                                        <TextField
                                            label="Tinklo ilgis, m"
                                            name="netLength"
                                            value={values.netLength || ''}
                                            error={errors.netLength}
                                            height={56}
                                            onChange={(e) => setFieldValue('netLength', Number(e))}
                                            type="number"
                                            // onFocus={preventNumInputFromScrolling}
                                        />
                                    )}
                                </Wrapper>
                                <StyledButton>Pridėti įrankį</StyledButton>
                            </FormContainer>
                        );
                    }}
                </Formik>
            </Popup>
        </>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Footer = styled.div`
    display: block;
    position: sticky;
    bottom: 0;
    cursor: pointer;
    padding: 16px 0;
    text-decoration: none;
    width: 100%;
    background-color: white;
`;

const StyledButton = styled(Button)`
    width: 100%;
    border-radius: 28px;
    height: 56px;
    display: block;
    line-height: 56px;
    font-size: 20px;
    font-weight: 600;
    padding: 0;
`;

const ButtonsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
    width: 100%;
`;

const FormContainer = styled(Form)`
    padding-top: 68px;
    padding-bottom: 40px;
`;

const FormTitle = styled.div`
    text-align: center;
    margin: 16px 0 32px 16px;
    font-size: 2.4rem;
    font-weight: bold;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 56px;
`;

const SectionTitle = styled.div`
    margin: 24px 0 8px;
    font-weight: 600;
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.text.accent};
`;

export default Tools;
