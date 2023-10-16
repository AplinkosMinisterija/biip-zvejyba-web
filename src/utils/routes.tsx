import Fishing from "../pages/Fishing.tsx";

export const slugs = {
  login: `/prisijungimas`,
  cantLogin: '/negalima_jungtis',
  fishing: '/zvejyba'

};

export const routes = [
  {
    slug: slugs.fishing,
    component: <Fishing />,
    regExp: new RegExp('^/zvejyba$'),
  },
];
