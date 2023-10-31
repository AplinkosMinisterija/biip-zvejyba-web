import { validationTexts } from './texts';
import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
    password: Yup.string().required(validationTexts.requireText),
});
