import Fishing from "../pages/Fishing.tsx";
import Profiles from "../pages/Profiles.tsx";

export const slugs = {
  login: `/prisijungimas`,
  profiles: "/profiliai",
  cantLogin: '/negalima_jungtis',
  fishing: '/zvejyba'

};

export const routes = [
  {
    slug: slugs.profiles,
    component: <Profiles />,
  },
  {
    slug: slugs.fishing,
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba$'),
  },
];
