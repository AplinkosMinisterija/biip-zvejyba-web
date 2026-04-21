import { map } from 'lodash';
import { LocationType, RoleTypes, SickReasons } from './constants';
import { buttonLabels, locationTypeLabels } from './texts';

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

export const getLocationTypeOptions = () =>
  map(LocationType, (type) => ({
    id: type,
    label: locationTypeLabels[type],
  }));
