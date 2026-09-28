import { expect, Page, test } from '@playwright/test';

const ESTUARY_PATH = '/zvejyba/marios/irankiai';
const CURRENT_FISHING_ID = 1;
const EARLIER_FISHING_ID = 0;

const texts = {
  check: 'Patikrinta',
  weigh: 'Sverti žuvį laive',
  blockedByType: 'Turite užbaigti tikrinti to paties tipo įrankius',
  catcher: 'Gaudyklė',
};

const profile = {
  id: 'freelancer',
  name: 'Testas Testauskas',
  role: 'OWNER',
  isInvestigator: false,
  freelancer: true,
  phone: '+37060000000',
};

const user = {
  id: '1',
  firstName: 'Testas',
  lastName: 'Testauskas',
  email: 'e2e-testas@biip.lt',
  role: 'OWNER',
  freelancer: true,
  profiles: [profile],
};

const NETS = { id: 1, label: 'Tinklas', type: 'NETS' };
const CATCHERS = { id: 2, label: texts.catcher, type: 'CATCHERS' };
const location = { id: '5', name: 'Baras 5', municipality: { id: 1, name: 'Neringa' } };

type Check = 'empty' | 'withFish';

const toolsGroup = (
  id: number,
  toolType: typeof NETS,
  sealNr: string,
  buildFishingId: number,
  check?: Check,
) => ({
  id,
  tools: [{ id, sealNr, toolType, data: { netLength: 50 } }],
  buildEvent: { id: `b${id}`, location, fishing: { id: buildFishingId, type: 'ESTUARY' } },
  ...(check === 'empty' ? { weightEvent: { id: `w${id}`, data: {} } } : {}),
  ...(check === 'withFish' ? { weightEvent: { id: `w${id}`, data: { 5: 3 } } } : {}),
});

// Two leftover nets plus one set today. The two leftovers are a checking
// session of their own: the first may be waved through as "Patikrinta", the
// last one of the type still has to be weighed.
const twoLeftoversOneFresh = [
  toolsGroup(11, NETS, '111', CURRENT_FISHING_ID), // set on this very trip
  toolsGroup(12, NETS, '112', EARLIER_FISHING_ID),
  toolsGroup(14, NETS, '114', EARLIER_FISHING_ID),
];

// A single leftover next to a net set today — nothing to pair it with, so the
// leftover must be weighed rather than waved through.
const oneLeftoverOneFresh = [
  toolsGroup(11, NETS, '111', CURRENT_FISHING_ID),
  toolsGroup(12, NETS, '112', EARLIER_FISHING_ID),
];

// Both leftover nets are done (one empty check, one weighed) and a third net
// went in this trip. Counting that fresh net would keep NETS "mid-checking"
// and lock every other tool type behind it.
const bothLeftoversDonePlusFresh = [
  toolsGroup(11, NETS, '111', EARLIER_FISHING_ID, 'empty'),
  toolsGroup(12, NETS, '112', EARLIER_FISHING_ID, 'withFish'),
  toolsGroup(13, NETS, '113', CURRENT_FISHING_ID),
  toolsGroup(21, CATCHERS, '221', EARLIER_FISHING_ID),
];

const card = (page: Page, sealNr: string) => page.getByText(`Plombų nr.: ${sealNr}`).first();

async function mockFishing(page: Page, builtTools: unknown[]) {
  await page.context().addCookies([
    { name: 'token', value: 'e2e-token', domain: 'localhost', path: '/' },
    { name: 'profileId', value: 'freelancer', domain: 'localhost', path: '/' },
  ]);

  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname.replace('/api', '');
    const body = (data: unknown) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });

    if (path === '/auth/me') return body(user);
    if (path === '/fishings/current') return body({ id: CURRENT_FISHING_ID, type: 'ESTUARY' });
    if (path === '/locations') return body(location);
    if (path === '/toolsGroups/notChecked') return body([]);
    if (path.startsWith('/toolsGroups/location/')) return body(builtTools);
    return body([]);
  });
}

test.use({
  geolocation: { latitude: 55.3, longitude: 21.35 },
  permissions: ['geolocation'],
});

test.describe('"Patikrinta" availability', () => {
  test('offers the check for a net left by an earlier trip', async ({ page }) => {
    await mockFishing(page, twoLeftoversOneFresh);
    await page.goto(ESTUARY_PATH);

    await card(page, '112').click();

    await expect(page.getByText(texts.check)).toBeVisible();
  });

  test('makes the last leftover of a type weighable, not checkable', async ({ page }) => {
    await mockFishing(page, oneLeftoverOneFresh);
    await page.goto(ESTUARY_PATH);

    await card(page, '112').click();

    await expect(page.getByText(texts.weigh)).toBeVisible();
    await expect(page.getByText(texts.check)).toHaveCount(0);
  });

  test('hides the check for a net set during this trip', async ({ page }) => {
    await mockFishing(page, twoLeftoversOneFresh);
    await page.goto(ESTUARY_PATH);

    await card(page, '111').click();

    // The popup is open — weighing is still offered, only the meaningless
    // "checked, nothing in it" shortcut is gone.
    await expect(page.getByText(texts.weigh)).toBeVisible();
    await expect(page.getByText(texts.check)).toHaveCount(0);
  });

  test('a net set this trip does not keep its type mid-checking', async ({ page }) => {
    await mockFishing(page, bothLeftoversDonePlusFresh);
    await page.goto(ESTUARY_PATH);

    await card(page, '221').click();

    await expect(page.getByText(texts.weigh)).toBeVisible();
    await expect(page.getByText(texts.blockedByType)).toHaveCount(0);
  });
});
