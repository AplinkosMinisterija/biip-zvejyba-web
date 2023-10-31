import Fishing from '../pages/Fishing.tsx';
import Profiles from '../pages/Profiles.tsx';
import Tools from '../pages/Tools.tsx';

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
};

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
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba$'),
  },
  {
    title: 'Mano žvejyba',
    subtitle: 'Pasirinkite žvejybos veiksmą',
    slug: slugs.fishing(':fishingId'),
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
    title: 'Įrankiai',
    subtitle: 'Valdykite leidžiamų naudoti įrankių sąrašą',
    slug: slugs.tools,
    component: <Tools />,
    regExp: new RegExp('^/irankiai$'),
  },
];
