import { RoleTypes, SickReasons } from './constants';
import { buttonLabels } from './texts';

export const roleOptions = [RoleTypes.USER, RoleTypes.USER_ADMIN];

export const skipOptions = [
  {
    label: buttonLabels.badWeather,
    value: SickReasons.BAD_WEATHER,
  },
  {
    label: buttonLabels.sick,
    value: SickReasons.SICK,
  },
  {
    label: buttonLabels.other,
    value: SickReasons.OTHER,
    additionalInfo: true,
  },
];
