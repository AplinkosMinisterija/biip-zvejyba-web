import { useFormik } from 'formik';
import { useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import Button, { ButtonColors } from '../components/buttons/Button';
import PasswordField from '../components/fields/PasswordField';
import TextField from '../components/fields/TextField';
import { LoginLayout } from '../components/layouts/Login';
import { MobileLoginLayout } from '../components/layouts/MobileLogin';
import Icon, { IconName } from '../components/other/Icon';
import api from '../utils/api';
import {
  getErrorMessage,
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
  handleUpdateTokens,
} from '../utils/functions';
import { useCheckUserInfo, useEGatesSign, useWindowSize } from '../utils/hooks';
import { buttonLabels } from '../utils/texts';
import { device, theme } from '../utils/theme';
import { loginSchema } from '../utils/validations';

class LoginProps {}

export const Login = () => {
  const [showLocalLogin, setShowLocalLogin] = useState(false);
  const isMobile = useWindowSize(device.mobileL);

  const loginMutation: any = useMutation((params: LoginProps) => api.login(params), {
    onError: ({ response }: any) => {
      const text = getErrorMessage(getReactQueryErrorMessage(response));

      if (text) {
        return setErrors({ password: text });
      }

      handleErrorToastFromServer();
    },
    onSuccess: (data) => {
      handleUpdateTokens(data);
    },
    retry: false,
  });

  const { mutateAsync: eGatesMutation, isLoading: eGatesSignLoading } = useEGatesSign();

  const { isLoading: userInfoLoading } = useCheckUserInfo();

  const loading = [loginMutation.isLoading, userInfoLoading].some((loading) => loading);

  const { values, errors, setFieldValue, handleSubmit, setErrors } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: false,
    validationSchema: loginSchema,
    onSubmit: loginMutation.mutateAsync,
  });

  const handleType = (field: string, value: string) => {
    setFieldValue(field, value);
    setErrors({});
  };

  const renderLoginFields = () => {
    return (
      <>
        <TextField
          label="Elektroninis paštas"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={(e) => handleType('email', e)}
        />
        <PasswordField
          label="Slaptažodis"
          value={values.password}
          error={errors.password}
          onChange={(e) => handleType('password', e)}
        />
        <ButtonContainer>
          <Button loading={loading} type="submit">
            {buttonLabels.login}
          </Button>
          <TransparentButton
            $color={theme.colors.text.retroBlack}
            type="button"
            onClick={() => eGatesMutation()}
          >
            <Icon name={IconName.eGate} />
            {buttonLabels.eGate}
          </TransparentButton>
        </ButtonContainer>
      </>
    );
  };

  if (isMobile) {
    return (
      <MobileLoginLayout>
        <FormContainer
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        >
          <InnerContainer>
            {!showLocalLogin ? (
              <ButtonContainer>
                <Button
                  leftIcon={<Icon name={IconName.eGate} />}
                  loading={eGatesSignLoading}
                  variant={ButtonColors.POWDER}
                  type="button"
                  onClick={() => eGatesMutation()}
                >
                  {buttonLabels.eGate}
                </Button>
                <TransparentButton
                  $color={theme.colors.powder}
                  type="button"
                  onClick={() => setShowLocalLogin(true)}
                >
                  {buttonLabels.loginWithPassword}
                </TransparentButton>
              </ButtonContainer>
            ) : (
              <MobileLoginContainer>{renderLoginFields()}</MobileLoginContainer>
            )}
          </InnerContainer>
        </FormContainer>
      </MobileLoginLayout>
    );
  }

  return (
    <LoginLayout>
      <FormContainer
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
      >
        <InnerContainer>
          {!showLocalLogin ? (
            <ButtonContainer>
              <Button
                leftIcon={<StyledEGateIcon name={IconName.eGate} />}
                loading={eGatesSignLoading}
                type="button"
                onClick={() => eGatesMutation()}
              >
                {buttonLabels.eGate}
              </Button>
              <TransparentButton
                $color={theme.colors.text.retroBlack}
                type="button"
                onClick={() => setShowLocalLogin(true)}
              >
                {buttonLabels.loginWithPassword}
              </TransparentButton>
            </ButtonContainer>
          ) : (
            renderLoginFields()
          )}
        </InnerContainer>
      </FormContainer>
    </LoginLayout>
  );
};

const ButtonContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
  justify-content: center;
  @media ${device.mobileL} {
    padding: 24px 16px;
  }
`;

const TransparentButton = styled.button<{ $color: string }>`
  color: ${({ $color }) => $color};
  display: flex;
  justify-content: center;
  font-size: 18px;
  gap: 12px;
  width: 100%;
  cursor: pointer;
`;

const StyledEGateIcon = styled(Icon)`
  path {
    fill: white;
  }
`;

const FormContainer = styled.form`
  width: 100%;
  height: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${device.mobileL} {
    max-width: 100%;
  }
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MobileLoginContainer = styled.div`
  background-color: white;
  border-radius: 16px 16px 0px 0px;
  width: 100%;
  padding: 47px 24px 24px 24px;
`;
