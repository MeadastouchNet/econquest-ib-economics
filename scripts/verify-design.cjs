// Theme and responsive checks for the shared presentation layer.
const { chromium } = require('C:/Users/jespe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const file = path.join(root, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(file, (err, data) => {
    res.writeHead(err ? 404 : 200, { 'Content-Type': mime[path.extname(file)] || 'text/plain' });
    res.end(err ? 'Not found' : data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.locator('#app h1').waitFor();
    const sections = await page.evaluate(async () => (await import('/js/content/units.js')).SECTIONS.map(s => s.id));
    const routes = ['/assessment', '/assessment/diagrams', '/assessment/diagrams/tax', '/assessment/papers/p3', '/assessment/cases', '/assessment/ia', '/assessment/coverage', '/', '/u/1', '/u/2', '/u/3', '/u/4', '/settings', '/stats', '/formulas', '/review', '/boss/2',
      ...sections.flatMap(id => ['hook', 'learn', 'lab', 'worked', 'quiz', 'explain'].map(step => `/s/${id}/${step}`))];
    for (const theme of ['light', 'dark']) {
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        for (const route of routes) {
          await page.evaluate(route => { location.hash = '#' + route; }, route);
          await page.waitForTimeout(35);
          assert(await page.locator('#app h1').count(), route);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme}/${width}: ${route}`);
        }
        await page.evaluate(() => { location.hash = '#/'; });
        await page.waitForTimeout(100);
        const colors = await page.locator('.hero .btn').evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, fg: getComputedStyle(el).color }));
        assert.equal(colors.bg, 'rgb(255, 214, 10)');
        assert.equal(colors.fg, 'rgb(18, 18, 18)');
        await page.screenshot({ path: path.join(root, `docs/screenshots/design-${theme}-${width}.png`), fullPage: true });
        await page.evaluate(() => { location.hash = '#/s/1.1a/quiz'; });
        await page.waitForTimeout(100);
        assert(await page.locator('.opt-key').count());
        await page.locator('.opt').first().click();
        assert.equal(await page.locator('.opt.correct .icon-check').count(), 1);
        assert(await page.locator('.feedback').count());
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(root, `docs/screenshots/quiz-${theme}-${width}.png`), fullPage: true });
      }
    }
    for (const os of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: os });
      await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme), os);
      const opposite = os === 'dark' ? 'light' : 'dark';
      await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, opposite);
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme), opposite);
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: ${routes.length} routes in both themes at desktop and 375px; yellow button contrast, quiz marks, automatic/manual themes; no browser errors.`);
  } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => server.close());
