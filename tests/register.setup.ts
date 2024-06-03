import { test, expect } from '@playwright/test'
import { goto, credentials } from './utils'

test('should register', async ({ page }) => {
  await goto(page, '/auth/register')
  await page.getByPlaceholder('name').fill('tester')
  await page.getByPlaceholder('email').fill(credentials.email)
  await page.getByPlaceholder('password').fill(credentials.password)
  await page.getByRole('button', { name: 'Register' }).click()
  await page.waitForTimeout(2000)
  const result = await page.getByTestId('registration-result').textContent()
  expect(result).toMatch(/ok|Email already used/)
})
