import { expect, Page, test } from '@playwright/test';

const SUMMARY_PATH = '/suvestine';

const labels = {
  zone: 'Žvejybos vieta',
  bar: 'Kuršių marių kvadratas',
  polder: 'Polderis',
  fishType: 'Žuvų rūšys',
  toolType: 'Įrankio tipas',
  byMonths: 'Skaidyti pagal mėnesius',
  byToolTypes: 'Rodyti pagal įrankių tipus',
};

const profile = {
  id: 5,
  name: 'Gamtos tyrimų centras',
  role: 'USER',
  isInvestigator: true,
  freelancer: false,
};

const user = { id: '1', firstName: 'Linas', lastName: 'Ložys', profiles: [profile] };

async function mockSummaryApi(page: Page) {
  const summaryRequests: URL[] = [];

  await page.context().addCookies([
    { name: 'token', value: 'e2e-token', domain: 'localhost', path: '/' },
    { name: 'profileId', value: String(profile.id), domain: 'localhost', path: '/' },
  ]);

  await page.route('**/api/**', (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace('/api', '');
    const body = (data: unknown) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });

    if (path === '/researches/catchSummary') {
      summaryRequests.push(url);
      return route.fulfill({ status: 200, contentType: 'application/octet-stream', body: 'xlsx' });
    }
    if (path === '/auth/me') return body(user);
    if (path === '/locations/fishing_sections') {
      return body([
        { id: 11, name: '11' },
        { id: 12, name: '12' },
      ]);
    }
    if (path === '/polders/all') return body([{ id: 1, name: 'Polderis A' }]);
    if (path === '/fishTypes/all') return body([{ id: 1, label: 'Karšis' }]);
    return body([]);
  });

  return summaryRequests;
}

const field = (page: Page, label: string) => page.getByLabel(label, { exact: true });

const exactly = (text: string) => new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);

const option = (page: Page, name: string) =>
  page.locator('[role=option]').filter({ hasText: exactly(name) });

async function pick(page: Page, label: string, name: string) {
  await field(page, label).click();
  await option(page, name).click();
}

async function openFilters(page: Page) {
  await page.goto(SUMMARY_PATH);
  await page.getByRole('button', { name: 'Open filter menu' }).click();
}

const submitFilters = (page: Page) => page.locator('form button[type=submit]').click();

const appliedFilters = (page: Page) =>
  page.locator('[aria-label^="Applied filter"]').allInnerTexts();

test.use({
  geolocation: { latitude: 55.3, longitude: 21.35 },
  permissions: ['geolocation'],
});

test.describe('catch summary — filters', () => {
  test('offers bars only while the lagoon alone is picked', async ({ page }) => {
    await mockSummaryApi(page);
    await openFilters(page);

    await expect(field(page, labels.bar)).toHaveCount(0);

    await pick(page, labels.zone, 'Kuršių marios');
    await expect(field(page, labels.bar)).toBeVisible();
    await expect(field(page, labels.polder)).toHaveCount(0);

    await pick(page, labels.bar, '12');
    await pick(page, labels.zone, 'Polderiai');

    await expect(field(page, labels.bar)).toHaveCount(0);
    await expect(field(page, labels.polder)).toHaveCount(0);
  });

  test('offers polders only while polders alone are picked', async ({ page }) => {
    await mockSummaryApi(page);
    await openFilters(page);

    await pick(page, labels.zone, 'Polderiai');
    await field(page, labels.polder).click();

    await expect(option(page, 'Polderis A')).toBeVisible();
    await expect(option(page, '12')).toHaveCount(0);
  });

  test('drops the picked bar once a second zone is added', async ({ page }) => {
    const requests = await mockSummaryApi(page);
    await openFilters(page);

    await pick(page, labels.zone, 'Kuršių marios');
    await pick(page, labels.bar, '12');
    await pick(page, labels.zone, 'Polderiai');
    await submitFilters(page);

    await expect
      .poll(() => appliedFilters(page))
      .not.toContainEqual(expect.stringMatching(labels.bar));

    await page.getByRole('button', { name: /Atsisiųsti suvestinę/ }).click();
    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0].searchParams.getAll('types')).toEqual(['ESTUARY', 'POLDERS']);
    expect(requests[0].searchParams.has('locationId')).toBe(false);
  });

  test('sends the picked filters and the report form with the download', async ({ page }) => {
    const requests = await mockSummaryApi(page);
    await openFilters(page);

    await pick(page, labels.zone, 'Kuršių marios');
    await pick(page, labels.bar, '12');
    await pick(page, labels.fishType, 'Karšis');
    await expect(field(page, labels.toolType)).toHaveCount(0);
    await submitFilters(page);

    await expect
      .poll(() => appliedFilters(page))
      .toEqual([
        `${labels.zone}: Kuršių marios`,
        `${labels.bar}: 12`,
        `${labels.fishType}: Karšis`,
      ]);

    for (const name of [labels.byMonths, labels.byToolTypes]) {
      await page.getByText(name, { exact: true }).click();
      await expect(page.getByRole('checkbox', { name })).toBeChecked();
    }
    await page.getByRole('button', { name: /Atsisiųsti suvestinę/ }).click();

    await expect.poll(() => requests.length).toBe(1);
    const params = requests[0].searchParams;
    expect(params.getAll('types')).toEqual(['ESTUARY']);
    expect(params.get('locationId')).toBe('12');
    expect(params.get('locationName')).toBe('12');
    expect(params.getAll('fishTypes')).toEqual(['1']);
    expect(params.has('toolTypes')).toBe(false);
    expect(params.get('byMonths')).toBe('true');
    expect(params.get('byToolTypes')).toBe('true');
  });
});
