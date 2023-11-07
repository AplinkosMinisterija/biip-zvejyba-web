import * as Yup from 'yup';
import { validationTexts } from './texts';

export const loginSchema = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
  password: Yup.string().required(validationTexts.requireText),
});

export const profileSchema = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
  phone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(/(86|\+3706)\d{7}/, validationTexts.badPhoneFormat),
});

export const tenantUserSchema = profileSchema.shape({
  firstName: Yup.string().required(validationTexts.requireText),
  lastName: Yup.string().required(validationTexts.requireText),
  personalCode: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .test('validatePersonalCode', validationTexts.personalCode, (value) => {
      return value.length === 11;
    }),
});
