import { IconName } from '../components/other/Icon';
import CurrentFishing from '../pages/CurrentFishing';
import Fishing from '../pages/Fishing';
import FishingJournal from '../pages/FishingJournal';
import Profile from '../pages/Profile';
import Profiles from '../pages/Profiles';
import Research from '../pages/Research';
import Tool from '../pages/Tool';
import Tools from '../pages/Tools';
import UserForm from '../pages/User';
import Users from '../pages/Users';
import FishingToolsEstuary from '../pages/FishingToolsEstuary';
import FishingWeight from '../pages/FishingWeight';
import FishingToolsInlandWatters from '../pages/FishingToolsInlandWaters';
import FishingToolsPolders from '../pages/FishingToolsPolders';
import { FishingTypeRoute } from './constants';

export const slugs = {
  login: `/prisijungimas`,
  profiles: '/profiliai',
  cantLogin: '/negalima_jungtis',
  fishingLocation: '/zvejyba',
  fishingCurrent: `/zvejyba/mano`,
  fishingTools: (type: string) => `/zvejyba/${type}/irankiai`,
  fishingWeight: `/zvejyba/svoris`,
  fishingToolCaughtFishes: (toolId: string) => `/zvejyba/irankiai/${toolId}/sugautos-zuvys`,
  fishingToolConnect: (toolId: string) => `/zvejyba/irankiai/${toolId}/irankiu_jungimas`,
  tools: '/irankiai',
  tool: (id: string) => `/irankiai/${id}`,
  users: '/nariai',
  user: (id: string) => `/nariai/${id}`,
  profile: '/profilis',
  researches: '/moksliniai-tyrimai',
  updateResearch: (id: number | string) => `/moksliniai-tyrimai/${id}`,
  newResearch: `/moksliniai-tyrimai/naujas`,
  fishingJournal: '/zvejybos_zurnalas',
  fishing: (fishingId: string) => `/zvejybos_zurnalas/${fishingId}`,
};

export type RouteType = (typeof routes)[0];

export enum Ids {
  FISHING_ID = ':fishingId',
  TOOL_ID = ':toolId',
  ID = ':id',
}

export const routes = [
  {
    slug: slugs.profiles,
    component: <Profiles />,
    regExp: new RegExp('^/profiliai$'),
  },
  {
    title: 'Mano žvejyba',
    subtitle: 'Pasirinkite žvejybos vietą',
    slug: slugs.fishingLocation,
    iconName: IconName.home,
    component: <CurrentFishing />,
    regExp: new RegExp('^/zvejyba$'),
  },
  {
    slug: slugs.fishingTools(FishingTypeRoute.ESTUARY),
    component: <FishingToolsEstuary />,
    back: true,
    regExp: new RegExp(`^/zvejyba/${FishingTypeRoute.ESTUARY}/irankiai$`),
  },
  {
    slug: slugs.fishingTools(FishingTypeRoute.INLAND_WATERS),
    component: <FishingToolsInlandWatters />,
    back: true,
    regExp: new RegExp(`^/zvejyba/${FishingTypeRoute.INLAND_WATERS}/irankiai$`),
  },
  {
    slug: slugs.fishingTools(FishingTypeRoute.POLDERS),
    component: <FishingToolsPolders />,
    back: true,
    regExp: new RegExp(`^/zvejyba/${FishingTypeRoute.POLDERS}/irankiai$`),
  },
  {
    title: 'Tikslus svoris, kg',
    slug: slugs.fishingWeight,
    component: <FishingWeight />,
    back: true,
    regExp: new RegExp('^/zvejyba/svoris$'),
  },
  {
    title: 'Žvejybos žurnalas',
    subtitle: 'Peržiūrėkite žvejybos istoriją',
    slug: slugs.fishingJournal,
    component: <FishingJournal />,
    regExp: new RegExp('^/zvevybos_zurnalas$'),
    iconName: IconName.journal,
  },
  {
    title: 'Žvejybos informacija',
    slug: slugs.fishing(':fishingId'),
    component: <Fishing />,
    regExp: new RegExp('^/zvejybos_zurnalas/[0-9]+$'),
    back: true,
  },
  {
    title: 'Nariai',
    subtitle: 'Valdykite įmonės darbuotojų sąrašą',
    slug: slugs.users,
    component: <Users />,
    tenantOwner: true,
    iconName: IconName.members,
  },
  {
    title: 'Nario informacija',
    slug: slugs.user(Ids.ID),
    component: <UserForm />,
    tenantOwner: true,
    back: true,
  },
  {
    title: 'Nario informacija',
    slug: slugs.user(Ids.ID),
    component: <UserForm />,
    tenantOwner: true,
    back: true,
  },
  {
    title: 'Įrankiai',
    subtitle: 'Valdykite leidžiamų naudoti įrankių sąrašą',
    slug: slugs.tools,
    component: <Tools />,
    regExp: new RegExp('^/irankiai$'),
    iconName: IconName.tools,
    back: true,
  },
  {
    title: 'Įrankio informacija',
    slug: slugs.tool(Ids.ID),
    component: <Tool />,
  },
  {
    title: 'Moksliniai tyrimai',
    subtitle: 'Mokslinių tyrimų duomenys',
    slug: slugs.researches,
    component: <Research />,
    iconName: IconName.researches,
    isInvestigator: true,
  },
  {
    title: 'Mokslinio tyrimo ataskaita',
    subtitle: 'Įveskite duomenis iš savo mokslinio tyrimo',
    back: true,
    slug: slugs.newResearch,
    component: <Research />,
    isInvestigator: true,
  },
  {
    title: 'Mokslinio tyrimo ataskaita',
    subtitle: 'Atnaujinkite duomenis iš savo mokslinio tyrimo',
    back: true,
    slug: slugs.updateResearch(Ids.ID),
    component: <Research />,
    isInvestigator: true,
  },
  {
    title: 'Profilis',
    slug: slugs.profile,
    component: <Profile />,
    iconName: IconName.profile,
  },
];
