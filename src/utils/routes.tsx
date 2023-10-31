import { IconName } from '../components/other/Icon';
import Fishing from '../pages/Fishing';
import Profile from '../pages/Profile';
import Profiles from '../pages/Profiles';
import Tools from '../pages/Tools';

export const slugs = {
  login: `/prisijungimas`,
  profiles: '/profiliai',
  cantLogin: '/negalima_jungtis',
  fishingLocation: '/zvejyba',
  fishing: (fishingId: string) => `/zvejyba/${fishingId}`,
  fishingTools: (fishingId: string) => `/zvejyba/${fishingId}/irankiai`,
  fishingWeight: (fishingId: string) => `/zvejyba/${fishingId}/svoris`,
  fishingToolFish: (fishingId: string, toolId: string) =>
    `/zvejyba/${fishingId}/irankiai/${toolId}/zuvis`,
  fishingToolConnect: (fishingId: string, toolId: string) =>
    `/zvejyba/${fishingId}/irankiai/${toolId}/irankiu_jungimas`,
  tools: '/irankiai',
  profile: '/profilis',
};

export type RouteType = (typeof routes)[0];

export const routes = [
  {
    slug: slugs.profiles,
    component: <Profiles />,
    regExp: new RegExp('^/profiliai$'),
  },
  {
    title: 'Kur žvejosite?',
    subtitle: 'Pasirinkite žvejybos vietą',
    slug: slugs.fishingLocation,
    iconName: IconName.fourSquares,
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba$'),
  },
  {
    title: 'Mano žvejyba',
    subtitle: 'Pasirinkite žvejybos veiksmą',
    slug: slugs.fishing(':fishingId'),
    iconName: IconName.home,
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba/[0-9]+$'),
  },
  {
    slug: slugs.fishingTools(':fishingId'),
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba/[0-9]+/irankiai$'),
    back: true,
  },
  {
    slug: slugs.fishingToolFish(':fishingId', ':toolId'),
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba/[0-9]+/irankiai[0-9]+/zuvis$'),
    back: true,
  },
  {
    slug: slugs.fishingToolConnect(':fishingId', ':toolId'),
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba/[0-9]+/irankiai[0-9]+/irankiu_jungimas$'),
    back: true,
  },
  {
    title: 'Tikslus svoris, kg',
    slug: slugs.fishingWeight(':fishingId'),
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba/[0-9]+/svoris$'),
    back: true,
  },
  {
    title: 'Žvejybos žurnalas',
    subtitle: 'Žvejybos istorija',
    slug: slugs.tools,
    component: <Tools />,
    regExp: new RegExp('^/irankiai$'),
    iconName: IconName.journal,
  },
  {
    title: 'Nariai',
    subtitle: 'Valdykite įmonės darbuotojų sąrašą',
    slug: slugs.tools,
    component: <Tools />,
    regExp: new RegExp('^/irankiai$'),
    iconName: IconName.members,
  },
  {
    title: 'Įrankiai',
    subtitle: 'Valdykite leidžiamų naudoti įrankių sąrašą',
    slug: slugs.tools,
    component: <Tools />,
    regExp: new RegExp('^/irankiai$'),
    iconName: IconName.tools,
  },
  {
    title: 'Nustatymai',
    subtitle: 'Pagindiniai nustatymai',
    slug: slugs.tools,
    component: <Tools />,
    regExp: new RegExp('^/irankiai$'),
    iconName: IconName.settings,
  },
  {
    title: 'Profilis',
    subtitle: 'Pagindiniai nustatymai',
    slug: slugs.profile,
    component: <Profile />,
    iconName: IconName.profile,
  },
];
