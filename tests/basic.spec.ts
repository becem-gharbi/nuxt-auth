import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'
import { goto, login, reload, credentials, register, logout } from './utils'

test.describe.configure({ mode: 'serial' })

test.use({
  nuxt: {
    rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
    port: 3000,
  },
})

test('should register', async ({ page }) => {
  await register(page)
})

test('should be logged in', async ({ page }) => {
  await login(page)

  await reload(page)
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()

  await goto(page, '/')
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()

  await goto(page, '/404')
  await page.getByRole('link', { name: 'Go back home' }).click()
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
})

test('should refresh session', async ({ page }) => {
  await login(page)

  const currentSession = await page.locator('li').first().textContent()
  expect(currentSession).toContain('true')
  await page.waitForTimeout(16000)
  await page.getByRole('button', { name: 'Update sessions' }).click()
  await page.waitForTimeout(2000)
  const newSession = await page.locator('li').first().textContent()
  expect(newSession).not.toEqual(currentSession)
})

test('should render user avatar', async ({ page }) => {
  await login(page)
  await expect(page.locator('img')).not.toHaveJSProperty('naturalWidth', 0)
})

test('should request password reset', async ({ page }) => {
  await goto(page, '/auth/login')

  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  await page.getByPlaceholder('email').fill(credentials.email)
  await page.getByRole('button', { name: 'Forgot password', exact: true }).click()
  await page.waitForTimeout(2000)
  const result = await page.getByTestId('password-reset-result').textContent()
  expect(result).toMatch(/ok/)
})

test('should revoke sessions', async ({ page }) => {
  await login(page)

  await page.getByRole('button', { name: 'Delete all my sessions' }).click()
  await page.getByRole('button', { name: 'Update sessions' }).click()
  await page.waitForTimeout(2000)
  const sessionsCount = await page.locator('li').count()
  expect(sessionsCount).toBe(1)

  await logout(page)
})
