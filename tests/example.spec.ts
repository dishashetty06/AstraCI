import { test, expect } from '@playwright/test';

test.describe('Todo App Basic Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should add a task', async ({ page }) => {
    await page.getByPlaceholder('Enter a task..').fill('Buy milk');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.locator('ol > li')).toContainText(['Buy milk']);
  });

  test('should delete a task', async ({ page }) => {
    await page.getByPlaceholder('Enter a task..').fill('Temp task');
    await page.getByRole('button', { name: 'Add' }).click();

    // Delete the newly added task (last item)
    const lastDeleteButton = page.getByRole('button', { name: 'Delete task' }).last();
    await lastDeleteButton.click();

    await expect(page.locator('ol > li')).not.toContainText(['Temp task']);
  });

 test('should move tasks up and down', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Select items by index
  const firstItem = page.locator('ol > li').nth(0);
  const secondItem = page.locator('ol > li').nth(1);

  // Move second item UP (☝️)
  await secondItem.getByRole('button', { name: 'Up' }).click();

  // After moving up → second item should now be first
  const newFirst = page.locator('ol > li').nth(0);
  await expect(newFirst.locator('.text')).toHaveText(/Eat breakfast|Do cp|Take a shower/);

  // Move the item DOWN (👇)
  await newFirst.getByRole('button', { name: 'Down' }).click();

  const newSecond = page.locator('ol > li').nth(1);
  await expect(newSecond.locator('.text')).toHaveText(/Eat breakfast|Do cp|Take a shower/);
});

});
