import type { Page } from '@playwright/test'
import { expect } from '@nuxt/test-utils/playwright'
import { joinURL } from 'ufo'

export const credentials = { email: 'test@test.com', password: 'abc123' }

export async function goto(page: Page, path: string) {
  const url = joinURL('http://localhost:3000', path)
  await page.goto(url)
  await page.waitForTimeout(1000) // wait for hydration
}

export async function reload(page: Page) {
  await page.reload()
  await page.waitForTimeout(1000) // wait for hydration
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

export async function register(page: Page) {
  await goto(page, '/auth/register')
  await page.getByPlaceholder('name').fill('tester')
  await page.getByPlaceholder('email').fill(credentials.email)
  await page.getByPlaceholder('password').fill(credentials.password)
  await page.getByRole('button', { name: 'Register' }).click()
  await page.waitForTimeout(4000)
  const result = await page.getByTestId('registration-result').textContent()
  expect(result).toMatch(/ok|Email already used/)
}
