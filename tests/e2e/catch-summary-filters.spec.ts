import { expect, Page, test } from '@playwright/test';

const SUMMARY_PATH = '/suvestine';

const labels = {
  zone: 'Žvejybos vieta',
  bar: 'Kuršių marių kvadratas',
  polder: 'Polderis',
  toolType: 'Įrankio tipas',
  byMonths: 'Skaidyti pagal mėnesius',
  byToolTypes: 'Rodyti pagal įrankių tipus',
  hidden: 'Laukas „Kvadratas / polderis“ nerodomas',
};

const profile = {
  id: 5,
  name: 'Gamtos tyrimų centras',
  role: 'USER',
  isInvestigator: true,
  freelancer: false,
};

const user = { id: '1', firstName: 'Linas', lastName: 'Ložys', profiles: [profile] };

const NETS = { id: 3, label: 'Statomieji tinklaičiai 45-50 mm' };

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
    if (path === '/toolTypes/all') return body([NETS]);
    return body([]);
  });

  return summaryRequests;
}

const field = (page: Page, label: string) => page.locator(`input[id="${label}"]`);

async function pick(page: Page, label: string, option: string) {
  await field(page, label).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

async function openFilters(page: Page) {
  await page.goto(SUMMARY_PATH);
  await page.getByRole('button', { name: /^Filtrai/ }).click();
}

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

    await pick(page, labels.bar, '12');
    await pick(page, labels.zone, 'Polderiai');

    await expect(field(page, labels.bar)).toHaveCount(0);
    await expect(page.getByText(labels.hidden)).toBeVisible();
  });

  test('offers polders only while polders alone are picked', async ({ page }) => {
    await mockSummaryApi(page);
    await openFilters(page);

    await pick(page, labels.zone, 'Polderiai');
    await field(page, labels.polder).click();

    await expect(page.getByRole('option', { name: 'Polderis A', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: '12', exact: true })).toHaveCount(0);
  });

  test('drops the picked bar once a second zone is added', async ({ page }) => {
    const requests = await mockSummaryApi(page);
    await openFilters(page);

    await pick(page, labels.zone, 'Kuršių marios');
    await pick(page, labels.bar, '12');
    await pick(page, labels.zone, 'Polderiai');
    await page.getByRole('button', { name: 'Filtruoti' }).click();

    await expect(page.getByText('Vieta: Kuršių marios, Polderiai')).toBeVisible();
    await expect(page.getByText(/Kvadratas:/)).toHaveCount(0);

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
    await pick(page, labels.toolType, NETS.label);
    await page.getByRole('button', { name: 'Filtruoti' }).click();

    await expect(
      page.getByText(`Vieta: Kuršių marios · Kvadratas: 12 · Įrankiai: ${NETS.label}`),
    ).toBeVisible();

    await page.getByRole('switch', { name: labels.byMonths }).check();
    await page.getByRole('switch', { name: labels.byToolTypes }).check();
    await page.getByRole('button', { name: /Atsisiųsti suvestinę/ }).click();

    await expect.poll(() => requests.length).toBe(1);
    const params = requests[0].searchParams;
    expect(params.getAll('types')).toEqual(['ESTUARY']);
    expect(params.get('locationId')).toBe('12');
    expect(params.get('locationName')).toBe('12');
    expect(params.getAll('toolTypes')).toEqual([String(NETS.id)]);
    expect(params.get('byMonths')).toBe('true');
    expect(params.get('byToolTypes')).toBe('true');
  });
});
