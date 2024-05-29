import { test, expect } from '@playwright/test'
import { goto, login, reload } from './utils'

test('should be logged in', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await login(page)

  await reload(page)
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()

  await goto(page, '/')
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()

  await page.goto('/404')
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  await page.getByRole('link', { name: 'Go back home' }).click()
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
})

test('should refresh session', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await login(page)

  const currentSession = await page.locator('li').first().textContent()
  expect(currentSession).toContain('true')
  await page.waitForTimeout(16000)
  await page.getByRole('button', { name: 'Update sessions' }).click()
  await page.waitForTimeout(2000)
  const newSession = await page.locator('li').first().textContent()
  expect(newSession).not.toEqual(currentSession)
})
