import { type Page, expect } from '@playwright/test'

export const credentials = { email: 'test@test.com', password: 'abc123' }

export async function goto(page: Page, path: string) {
  await page.goto(path)
  await expect(page.getByTestId('hydration-check')).toBeAttached()
}

export async function reload(page: Page) {
  await page.reload()
  await expect(page.getByTestId('hydration-check')).toBeAttached()
}

export async function login(page: Page) {
  await goto(page, '/auth/login')
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  await page.getByPlaceholder('email').fill(credentials.email)
  await page.getByPlaceholder('password').fill(credentials.password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Logout' }).click()
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
}
