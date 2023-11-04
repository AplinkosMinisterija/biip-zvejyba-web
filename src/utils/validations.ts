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
