import { map } from 'lodash';
import { LocationType, RoleTypes, SickReasons } from './constants';
import { buttonLabels, locationTypeLabels, summaryZoneLabels } from './texts';

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

export const getSummaryZoneOptions = () =>
  [LocationType.ESTUARY, LocationType.INLAND_WATERS, LocationType.POLDERS].map((type) => ({
    id: type,
    label: summaryZoneLabels[type],
  }));
