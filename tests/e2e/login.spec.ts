import { expect, Page, test } from '@playwright/test';

const LOGIN_PATH = '/prisijungimas';

// Real staging credentials come from CI secrets; the happy-path and
// wrong-password tests are skipped when they are not provided (e.g. fork PRs).
const E2E_USER_EMAIL = process.env.E2E_USER_EMAIL;
const E2E_USER_PASSWORD = process.env.E2E_USER_PASSWORD;
const hasCredentials = !!E2E_USER_EMAIL && !!E2E_USER_PASSWORD;

const texts = {
  eGate: 'Prisijungti per el. valdžios vartus',
  loginWithPassword: 'Prisijungti su slaptažodžiu',
  login: 'Prisijungti',
  required: 'Privalomas laukelis',
  // KNOWN BUG: rejected logins should show the specific messages from
  // texts.ts ('Blogas elektroninis paštas arba slaptažodis'), but
  // getReactQueryErrorMessage (functions.ts) resolves data.type first
  // ('WRONG_PASSWORD') while the message map is keyed by message strings
  // ('Wrong password.'), so the generic fallback renders instead. Tighten
  // the two assertions below to the specific texts once that is fixed.
  loginRejected: 'Įvyko nenumatyta klaida, prašome pabandyti vėliau',
};

// The login page shows only the eGate option at first — the email/password
// form is revealed by the "Prisijungti su slaptažodžiu" button.
async function openPasswordLogin(page: Page) {
  await page.goto(LOGIN_PATH);
  await page.getByRole('button', { name: texts.loginWithPassword }).click();
  await expect(page.locator('input[type="email"]')).toBeVisible();
}

// Inputs have no label association or name attribute, so target them by type.
function emailInput(page: Page) {
  return page.locator('input[type="email"]');
}

function passwordInput(page: Page) {
  return page.locator('input[type="password"]');
}

function submitButton(page: Page) {
  return page.getByRole('button', { name: texts.login, exact: true });
}

function trackLoginRequests(page: Page) {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/auth/login')) {
      requests.push(request.url());
    }
  });
  return requests;
}

test.describe('Login page', () => {
  test('shows both login options (eGate and password)', async ({ page }) => {
    await page.goto(LOGIN_PATH);

    await expect(page.getByRole('button', { name: texts.eGate })).toBeVisible();
    await expect(page.getByRole('button', { name: texts.loginWithPassword })).toBeVisible();
  });

  test('empty submit shows required-field errors and sends no request', async ({ page }) => {
    await openPasswordLogin(page);
    const loginRequests = trackLoginRequests(page);

    await submitButton(page).click();

    await expect(page.getByText(texts.required)).toHaveCount(2);
    expect(loginRequests).toHaveLength(0);
    await expect(page).toHaveURL(new RegExp(LOGIN_PATH));
  });

  test('invalid email format is blocked before reaching the API', async ({ page }) => {
    await openPasswordLogin(page);
    const loginRequests = trackLoginRequests(page);

    await emailInput(page).fill('netinkamas-pastas');
    await passwordInput(page).fill('betkoks-slaptazodis');
    await submitButton(page).click();

    // Either native email validation or the Yup schema stops the submit —
    // the essential invariant is that no login request leaves the browser.
    await expect(page).toHaveURL(new RegExp(LOGIN_PATH));
    expect(loginRequests).toHaveLength(0);
  });

  test('unknown email is rejected with a visible error', async ({ page }) => {
    await openPasswordLogin(page);

    await emailInput(page).fill('e2e-neegzistuojantis-naudotojas@biip.lt');
    await passwordInput(page).fill('BetKoksSlaptazodis1!');
    await submitButton(page).click();

    await expect(page.getByText(texts.loginRejected)).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(LOGIN_PATH));
  });

  test('wrong password is rejected with a visible error', async ({ page }) => {
    test.skip(!hasCredentials, 'E2E_USER_EMAIL / E2E_USER_PASSWORD are not set');
    await openPasswordLogin(page);

    await emailInput(page).fill(E2E_USER_EMAIL!);
    await passwordInput(page).fill('TyciaBlogasSlaptazodis1!');
    await submitButton(page).click();

    await expect(page.getByText(texts.loginRejected)).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(LOGIN_PATH));
  });

  test('valid credentials log the user in', async ({ page }) => {
    test.skip(!hasCredentials, 'E2E_USER_EMAIL / E2E_USER_PASSWORD are not set');
    await openPasswordLogin(page);

    await emailInput(page).fill(E2E_USER_EMAIL!);
    await passwordInput(page).fill(E2E_USER_PASSWORD!);
    await submitButton(page).click();

    // A fresh login lands on profile selection (/profiliai) or, with a
    // remembered profile, straight on /zvejyba.
    await page.waitForURL(/\/(profiliai|zvejyba)/, { timeout: 20_000 });

    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === 'token')?.value).toBeTruthy();
  });
});
