import { expect, Page, test } from '@playwright/test';

const CURRENT_FISHING_PATH = '/zvejyba';
const WEIGHT_PATH = '/zvejyba/svoris';

const texts = {
  notCheckedTitle: 'Nepatikrinti įrankiai',
  endFishingTitle: 'Žvejybos pabaiga',
  barName: '7 baras',
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

type Weights = { preliminary: Record<string, number>; unfinishedCheckLocations: unknown[] };

async function mockFishing(page: Page, weights: Weights, firstWeights?: Weights) {
  let weightsCalls = 0;
  await page.context().addCookies([
    { name: 'token', value: 'e2e-token', domain: 'localhost', path: '/' },
    { name: 'profileId', value: 'freelancer', domain: 'localhost', path: '/' },
  ]);

  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname.replace('/api', '');
    const body = (data: unknown) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });

    if (path === '/auth/me') return body(user);
    if (path === '/fishings/current') return body({ id: 1, type: 'ESTUARY' });
    if (path === '/fishings/weights') {
      const current = weightsCalls++ === 0 && firstWeights ? firstWeights : weights;
      return body({ total: {}, hasUncompletedTools: false, ...current });
    }
    return body([]);
  });
}

const largeButton = (page: Page, label: string) =>
  page.getByRole('button', { name: label, exact: true });

test.use({
  geolocation: { latitude: 55.3, longitude: 21.35 },
  permissions: ['geolocation'],
});

test.describe('Unchecked tools warning before shore weighing', () => {
  const unfinished = [{ id: '7', name: texts.barName }];

  test('"Sverti" warns first, then opens the weighing page', async ({ page }) => {
    await mockFishing(page, { preliminary: { 5: 3 }, unfinishedCheckLocations: unfinished });
    await page.goto(CURRENT_FISHING_PATH);

    await largeButton(page, 'Sverti').click();

    await expect(page.getByText(texts.notCheckedTitle)).toBeVisible();
    await expect(page.getByText(texts.barName)).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(CURRENT_FISHING_PATH);

    await page.getByRole('button', { name: 'Uždaryti' }).click();

    await expect(page).toHaveURL(new RegExp(`${WEIGHT_PATH}$`));
  });

  test('"Sverti" goes straight to the weighing page when nothing is left unchecked', async ({
    page,
  }) => {
    await mockFishing(page, { preliminary: { 5: 3 }, unfinishedCheckLocations: [] });
    await page.goto(CURRENT_FISHING_PATH);

    await largeButton(page, 'Sverti').click();

    await expect(page).toHaveURL(new RegExp(`${WEIGHT_PATH}$`));
    await expect(page.getByText(texts.notCheckedTitle)).toHaveCount(0);
  });

  test('"Sverti" decides on fresh data, not the payload cached before the checks', async ({
    page,
  }) => {
    await mockFishing(
      page,
      { preliminary: { 5: 3 }, unfinishedCheckLocations: unfinished },
      { preliminary: { 5: 3 }, unfinishedCheckLocations: [] },
    );
    await page.goto(CURRENT_FISHING_PATH);

    await largeButton(page, 'Sverti').click();

    await expect(page.getByText(texts.notCheckedTitle)).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(CURRENT_FISHING_PATH);
  });

  test('a repeated tap while the check is loading opens the weighing page once', async ({
    page,
  }) => {
    await mockFishing(page, { preliminary: { 5: 3 }, unfinishedCheckLocations: [] });
    await page.goto(CURRENT_FISHING_PATH);
    await largeButton(page, 'Sverti').waitFor();
    await page.route(
      (url) => url.pathname.endsWith('/fishings/weights'),
      async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.fallback();
      },
    );

    await largeButton(page, 'Sverti').click();
    await largeButton(page, 'Sverti').click();
    await expect(page).toHaveURL(new RegExp(`${WEIGHT_PATH}$`));

    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${CURRENT_FISHING_PATH}$`));
  });

  test('"Baigti" does not warn', async ({ page }) => {
    await mockFishing(page, { preliminary: {}, unfinishedCheckLocations: unfinished });
    await page.goto(CURRENT_FISHING_PATH);

    await largeButton(page, 'Baigti').click();

    await expect(page.getByText(texts.endFishingTitle)).toBeVisible();
    await expect(page.getByText(texts.notCheckedTitle)).toHaveCount(0);
  });
});
