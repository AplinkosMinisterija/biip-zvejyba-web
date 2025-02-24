import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import { ToolTypeType } from './constants';
import { validationTexts } from './texts';
import { phoneNumberRegexPattern } from '@aplinkosministerija/design-system';

export const loginSchema = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
  password: Yup.string().required(validationTexts.requireText),
});

export const profileSchema = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
  phone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
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

export const toolSchema = Yup.object().shape({
  type: Yup.string().required(validationTexts.requireText),
  sealNr: Yup.string().required(validationTexts.requireText),
  toolType: Yup.object().required(validationTexts.requireText),
  eyeSize: Yup.number().required(validationTexts.requireText),
  eyeSize2: Yup.number().when(['type'], (type: any, schema) => {
    if (type[0] === ToolTypeType.CATCHER) {
      return schema.required(validationTexts.requireText);
    }
    return schema.nullable();
  }),
  eyeSize3: Yup.number().when(['type'], (type: any, schema) => {
    if (type[0] === ToolTypeType.CATCHER) {
      return schema.required(validationTexts.requireText);
    }
    return schema.nullable();
  }),
  netLength: Yup.number().when(['type'], (type: any, schema) => {
    if (type[0] === ToolTypeType.NET) {
      return schema.required(validationTexts.requireText);
    }
    return schema.nullable();
  }),
});

export const locationSchema = Yup.lazy((_, { context }) => {
  const { x, y, location } = context as any;

  const obj: any = {};

  if ((!x || !y) && !location) {
    obj.location = Yup.string().required(validationTexts.requireSelect);
  }

  if (!x && !location) {
    obj.x = Yup.string().required(validationTexts.requireSelect);
  }

  if (!y && !location) {
    obj.y = Yup.string().required(validationTexts.requireSelect);
  }

  if (!isEmpty(obj)) return Yup.object().shape(obj);

  return Yup.mixed().notRequired();
});
