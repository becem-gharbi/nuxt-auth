import { test, expect } from '@playwright/test'
import { login, logout } from './utils'

test('should revoke sessions', async ({ page }) => {
  await login(page)

  await page.getByRole('button', { name: 'Delete all my sessions' }).click()
  await page.getByRole('button', { name: 'Update sessions' }).click()
  await page.waitForTimeout(2000)
  const sessionsCount = await page.locator('li').count()
  expect(sessionsCount).toBe(1)

  await logout(page)
})
