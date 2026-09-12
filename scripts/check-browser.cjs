// Visual-fixture checks, not a replacement for a Jekyll build.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('path');
const assert = require('assert');
(async () => {
 const browser = await chromium.launch({headless:true,channel:'chrome'});
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[]; page.on('pageerror',error=>errors.push(error.message));
 await page.goto('file:///'+path.resolve('_preview/index.html').replaceAll('\\','/'));
 await page.screenshot({path:'_preview/desktop.png',fullPage:true});
 assert.equal(await page.locator('.publication:visible').count(),5);
 await page.locator('#show-publications').click();
 assert.equal(await page.locator('.publication:visible').count(),54);
 await page.locator('#publication-search').fill('Semantic segmentation in satellite');
 assert.equal(await page.locator('.publication:visible').count(),1);
 await page.locator('#publication-search').fill('no-match-xyz');
 assert.equal(await page.locator('.publication:visible').count(),0);
 await page.locator('#publication-search').fill('');
 await page.locator('#publication-type').selectOption('Book');
 assert.equal(await page.locator('.publication:visible').count(),2);
 await page.locator('#publication-type').selectOption('all');
 for(const width of [375,768,1440]) {
  await page.setViewportSize({width,height:900});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
 }
 await page.setViewportSize({width:375,height:812});
 await page.locator('.menu-toggle').click();
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 await page.locator('.menu-toggle').click();
 await page.locator('nav a[href="#research"]').click();
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'_preview/mobile.png',fullPage:true});
 assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.filter(img=>!img.complete||img.naturalWidth===0).length),0);
 assert.deepEqual(errors,[]);
 const nojs=await browser.newContext({javaScriptEnabled:false});
 const fallback=await nojs.newPage();
 await fallback.goto(page.url().split('#')[0]);
 assert.equal(await fallback.locator('.publication:visible').count(),54);
 console.log('PASS: publication search/types/expansion, mobile menu/Escape/link close, image loads, no horizontal overflow at 375/768/1440, no JS errors, and no-JS bibliography.');
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
