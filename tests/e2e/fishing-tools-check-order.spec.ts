import { expect, Page, test } from '@playwright/test';

const POLDERS_PATH = '/zvejyba/polderiai/irankiai';
const ESTUARY_PATH = '/zvejyba/marios/irankiai';

const texts = {
  blockedByType: 'Turite užbaigti tikrinti to paties tipo įrankius',
  weighPopup: 'Apytikslis svoris',
  polderName: 'Rusnės polderis',
  otherTypeTool: 'Gaudyklė',
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
const CATCHERS = { id: 2, label: 'Gaudyklė', type: 'CATCHERS' };

const toolsGroup = (id: number, toolType: typeof NETS, sealNr: string, weighed: boolean) => ({
  id,
  tools: [{ id, sealNr, toolType, data: { netLength: 50 } }],
  buildEvent: { id: `b${id}`, location: { id: '1', name: texts.polderName } },
  ...(weighed ? { weightEvent: { id: `w${id}`, data: { 5: 3 } } } : {}),
});

// One net of two already weighed → the shared guard marks NETS as
// "mid-checking", which is exactly the state that used to lock the
// catcher card on every tools screen.
const builtTools = [
  toolsGroup(11, NETS, '111', true),
  toolsGroup(12, NETS, '112', false),
  toolsGroup(21, CATCHERS, '221', false),
];

async function mockFishing(page: Page, fishingType: 'POLDERS' | 'ESTUARY') {
  const location =
    fishingType === 'POLDERS'
      ? { id: 'polderiai', name: 'Polderiai', municipality: { id: 1, name: 'Šilutė' } }
      : { id: '5', name: 'Baras 5', municipality: { id: 1, name: 'Neringa' } };

  await page.context().addCookies([
    { name: 'token', value: 'e2e-token', domain: 'localhost', path: '/' },
    { name: 'profileId', value: 'freelancer', domain: 'localhost', path: '/' },
  ]);

  // Everything is mocked so the scenario (a half-checked net set next to an
  // untouched catcher) is reproducible and never depends on staging data.
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname.replace('/api', '');
    const body = (data: unknown) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });

    if (path === '/auth/me') return body(user);
    if (path === '/fishings/current') return body({ id: 1, type: fishingType });
    if (path === '/locations') return body(location);
    if (path === '/polders/all') return body([{ id: 1, name: texts.polderName, area: 100 }]);
    if (path === '/toolsGroups/notChecked') return body([]);
    if (path.startsWith('/toolsGroups/location/')) return body(builtTools);
    return body([]);
  });
}

// The polders screen only lists tools once a polder is picked by hand. The
// edit control is an icon with no accessible name, so it is targeted by its
// pencil path.
async function pickPolder(page: Page) {
  await page.getByText('Polderiai', { exact: true }).first().waitFor();
  await page.locator('svg:has(path[d^="M14.06 9.02"])').first().click();
  await page.getByText('Pasirinkite polderį').waitFor();
  await page.getByText('Polderis').first().click();
  await page.getByText(texts.polderName).first().click();
  await page.getByRole('button', { name: 'Saugoti' }).click();
}

function otherTypeCard(page: Page) {
  return page.getByText(texts.otherTypeTool).first();
}

test.use({
  geolocation: { latitude: 55.3, longitude: 21.35 },
  permissions: ['geolocation'],
});

test.describe('Tool checking order', () => {
  test('polders allow checking another tool type mid-session', async ({ page }) => {
    await mockFishing(page, 'POLDERS');
    await page.goto(POLDERS_PATH);
    await pickPolder(page);

    await otherTypeCard(page).click();

    await expect(page.getByText(texts.weighPopup)).toBeVisible();
    await expect(page.getByText(texts.blockedByType)).toHaveCount(0);
  });

  test('estuary still enforces finishing one tool type first', async ({ page }) => {
    await mockFishing(page, 'ESTUARY');
    await page.goto(ESTUARY_PATH);

    await otherTypeCard(page).click();

    await expect(page.getByText(texts.blockedByType)).toBeVisible();
    await expect(page.getByText(texts.weighPopup)).toHaveCount(0);
  });
});
