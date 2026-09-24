import { expect, Page, test } from '@playwright/test';

const WEIGHT_PATH = '/zvejyba/svoris';

const texts = {
  save: 'Saugoti pakeitimus',
  confirm: 'Suprantu ir sutinku',
  rule: 'Svoris krante negali skirtis daugiau nei 20 % nuo svorio laive.',
  generic: 'Kiekvienos žuvies svoris krante negali skirtis daugiau nei 20 % nuo svorio laive.',
  success: 'Žuvis sėkmingai pasverta krante.',
  unexpected: 'Įvyko nenumatyta klaida, prašome pabandyti vėliau',
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

const BREAM = { id: 1, label: 'Karšis' };
const SMELT = { id: 2, label: 'Stinta' };

// What the API sends when the onshore weight misses the boat weight by more
// than 20% — `invalidFish` is what lets the app name the species.
const weightDifferenceError = {
  name: 'ValidationError',
  message: 'Weight difference greater than 20%',
  code: 422,
  type: 'WEIGHT_DIFFERENCE',
  data: {
    invalidFish: [
      { id: BREAM.id, label: BREAM.label, preliminaryAmount: 30, amount: 20 },
      { id: SMELT.id, label: SMELT.label, preliminaryAmount: 12, amount: 5 },
    ],
  },
};

async function mockShoreWeighing(page: Page, weightError: unknown, status = 422) {
  await page.context().addCookies([
    { name: 'token', value: 'e2e-token', domain: 'localhost', path: '/' },
    { name: 'profileId', value: 'freelancer', domain: 'localhost', path: '/' },
  ]);

  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname.replace('/api', '');
    const body = (data: unknown) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });

    if (path === '/fishings/weight') {
      return route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(weightError),
      });
    }
    if (path === '/auth/me') return body(user);
    if (path === '/fishings/current') return body({ id: 1, type: 'ESTUARY' });
    if (path === '/fishTypes/all') return body([BREAM, SMELT]);
    if (path === '/fishings/weights') return body({ preliminary: { 1: 30, 2: 12 }, total: {} });
    return body([]);
  });
}

async function submitWeights(page: Page) {
  await page.goto(WEIGHT_PATH);
  await page.getByRole('button', { name: texts.save }).click();
  await page.getByRole('button', { name: texts.confirm }).click();
}

test.use({
  geolocation: { latitude: 55.3, longitude: 21.35 },
  permissions: ['geolocation'],
});

test.describe('onshore weighing — 20% difference', () => {
  test('names each fish that missed, with the boat and shore weights', async ({ page }) => {
    await mockShoreWeighing(page, weightDifferenceError);

    await submitWeights(page);

    await expect(page.getByText('Karšis: laive 30 kg, krante 20 kg')).toBeVisible();
    await expect(page.getByText('Stinta: laive 12 kg, krante 5 kg')).toBeVisible();
    await expect(page.getByText(texts.rule)).toBeVisible();
  });

  test('does not report the catch as saved', async ({ page }) => {
    await mockShoreWeighing(page, weightDifferenceError);

    await submitWeights(page);

    await expect(page.getByText(texts.rule)).toBeVisible();
    await expect(page.getByText(texts.success)).toHaveCount(0);
    // The named message is the only one — no generic toast stacked on top.
    await expect(page.getByText(texts.unexpected)).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`${WEIGHT_PATH}$`));
  });

  test('falls back to the generic message when the API sends no species', async ({ page }) => {
    const { data, ...withoutSpecies } = weightDifferenceError;
    await mockShoreWeighing(page, withoutSpecies);

    await submitWeights(page);

    await expect(page.getByText(texts.generic)).toBeVisible();
  });

  test('still reports a failure the app cannot translate', async ({ page }) => {
    await mockShoreWeighing(page, { name: 'MoleculerError', message: 'Boom' }, 500);

    await submitWeights(page);

    await expect(page.getByText(texts.unexpected)).toBeVisible();
    await expect(page.getByText(texts.success)).toHaveCount(0);
  });
});
