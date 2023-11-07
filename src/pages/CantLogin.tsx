import styled from 'styled-components';
import { device } from '../utils/theme';
import { LoginLayout } from '../components/layouts/Login';

export const CantLogin = () => {
  return (
    <LoginLayout>
      <>
        <H1>Anketa neaktyvi</H1>
        <Description>
          Jeigu esate įmonės vadovas arba privatus žuvinimą vykdantis asmuo, susisiekite su Aplinkos
          apsaugos departamentu (
          <Email href={`mailto:'prieiga@aad.am.lt'`}>prieiga@aad.am.lt</Email> )
        </Description>
        <Or>arba</Or>
        <Description>
          Jeigu jungiatės kaip įmonės darbuotojas, susisiekite su savo įmonės vadovu
        </Description>
      </>
    </LoginLayout>
  );
};

const Description = styled.div`
  text-align: center;
  font: normal normal medium 1.6rem/26px Manrope;
  letter-spacing: 0px;
  color: #7a7e9f;
  width: 70%;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const Or = styled.div`
  text-align: center;
  font: normal normal medium 1.6rem/26px Manrope;
  letter-spacing: 0px;
  margin: 16px 0;
  color: ${({ theme }) => theme.colors.primary};
  width: 70%;
`;

const H1 = styled.h1`
  text-align: center;
  font: normal normal bold 32px/44px Manrope;
  letter-spacing: 0px;
  color: #121a55;
  opacity: 1;
  margin: 0px 0px 16px 0px;

  @media ${device.mobileL} {
    padding-bottom: 0px;
  }
`;

const Email = styled.a`
  color: ${({ theme }) => theme.colors.primary};
`;
