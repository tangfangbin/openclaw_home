const { chromium } = require('playwright');

async function scrapeWithRetry(url, options, maxRetries = 3) {
  const { browser, context } = options;
  const page = await context.newPage();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  Attempt ${attempt}/${maxRetries}...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(3000);
      return page;
    } catch (e) {
      console.log(`  Timeout, waiting 5s before retry...`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }
  return null;
}

async function scrapeAll() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const results = {};

  // ========== 国内来源 ==========

  // 36氪
  try {
    console.log('\n[36氪] fetching...');
    const page = await scrapeWithRetry('https://36kr.com/newsflashes', { browser, context });
    if (page) {
      const articles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('.kr-newsflash-flow .kr-newsflash-item a, .newsflash-item a').forEach((el, i) => {
          if (i < 15) {
            const title = el.textContent.trim().replace(/\s+/g, ' ');
            if (title.length > 10) {
              items.push({ title, url: el.href });
            }
          }
        });
        return items;
      });
      results['36kr'] = articles.filter(a => a.title.length > 10);
      console.log(`  Got ${results['36kr'].length} items`);
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // 量子位
  try {
    console.log('\n[量子位] fetching...');
    const page = await scrapeWithRetry('https://www.qbitai.com/', { browser, context });
    if (page) {
      const articles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('a').forEach(el => {
          const href = el.href;
          const text = el.textContent.trim().replace(/\s+/g, ' ');
          if (href.includes('qbitai.com') && href.match(/\/\d{4,}/) && 
              text.length > 15 && text.length < 80 && !href.includes('/category')) {
            items.push({ title: text, url: href });
          }
        });
        const seen = new Set();
        return items.filter(a => {
          if (seen.has(a.url)) return false;
          seen.add(a.url);
          return true;
        });
      });
      results['量子位'] = articles;
      console.log(`  Got ${results['量子位'].length} items`);
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // 机器之心
  try {
    console.log('\n[机器之心] fetching...');
    const page = await scrapeWithRetry('https://www.jiqizhixin.com/', { browser, context });
    if (page) {
      const articles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('a').forEach(el => {
          const href = el.href;
          const text = el.textContent.trim().replace(/\s+/g, ' ');
          if (href.includes('jiqizhixin.com/articles') && text.length > 15 && text.length < 100) {
            items.push({ title: text, url: href });
          }
        });
        const seen = new Set();
        return items.filter(a => {
          if (seen.has(a.url)) return false;
          seen.add(a.url);
          return true;
        });
      });
      results['机器之心'] = articles;
      console.log(`  Got ${results['机器之心'].length} items`);
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // 虎嗅
  try {
    console.log('\n[虎嗅] fetching...');
    const page = await scrapeWithRetry('https://www.huxiu.com/channels/all', { browser, context });
    if (page) {
      const articles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('a').forEach(el => {
          const href = el.href;
          const text = el.textContent.trim().replace(/\s+/g, ' ');
          if (href.includes('huxiu.com') && href.match(/\/\d+\.html/) && 
              text.length > 10 && text.length < 80) {
            items.push({ title: text, url: href });
          }
        });
        const seen = new Set();
        return items.filter(a => {
          if (seen.has(a.url)) return false;
          seen.add(a.url);
          return true;
        });
      });
      results['虎嗅'] = articles;
      console.log(`  Got ${results['虎嗅'].length} items`);
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // ========== 海外来源 ==========

  // VentureBeat
  try {
    console.log('\n[VentureBeat] fetching...');
    const page = await scrapeWithRetry('https://venturebeat.com/category/ai/', { browser, context });
    if (page) {
      const articles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('h2 a, .story-header h2 a').forEach((el, i) => {
          if (i < 15) {
            const title = el.textContent.trim().replace(/\s+/g, ' ');
            const url = el.href;
            if (title && title.length > 10) {
              items.push({ title, url });
            }
          }
        });
        return items;
      });
      results['VentureBeat'] = articles;
      console.log(`  Got ${results['VentureBeat'].length} items`);
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // TechCrunch
  try {
    console.log('\n[TechCrunch] fetching...');
    const page = await scrapeWithRetry('https://techcrunch.com/category/artificial-intelligence/', { browser, context });
    if (page) {
      const articles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('h3 a, .loop-card__title a').forEach((el, i) => {
          if (i < 15) {
            const title = el.textContent.trim().replace(/\s+/g, ' ');
            if (title.length > 15) {
              items.push({ title, url: el.href });
            }
          }
        });
        return items;
      });
      results['TechCrunch'] = articles;
      console.log(`  Got ${results['TechCrunch'].length} items`);
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // Ars Technica
  try {
    console.log('\n[Ars Technica] fetching...');
    const page = await scrapeWithRetry('https://arstechnica.com/ai/', { browser, context });
    if (page) {
      const articles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('h2 a, .teaser h2 a').forEach((el, i) => {
          if (i < 15) {
            const title = el.textContent.trim().replace(/\s+/g, ' ');
            if (title.length > 15) {
              items.push({ title, url: el.href });
            }
          }
        });
        return items;
      });
      results['ArsTechnica'] = articles;
      console.log(`  Got ${results['ArsTechnica'].length} items`);
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // The Verge
  try {
    console.log('\n[The Verge] fetching...');
    const page = await scrapeWithRetry('https://www.theverge.com/artificial-intelligence', { browser, context });
    if (page) {
      const articles = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('h2 a, h3 a').forEach((el, i) => {
          if (i < 15 && el.href.includes('theverge.com')) {
            const title = el.textContent.trim().replace(/\s+/g, ' ');
            if (title.length > 15) {
              items.push({ title, url: el.href });
            }
          }
        });
        return items;
      });
      results['TheVerge'] = articles;
      console.log(`  Got ${results['TheVerge'].length} items`);
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  await browser.close();

  // 输出结果
  console.log('\n\n=== FINAL RESULTS ===\n');
  for (const [source, articles] of Object.entries(results)) {
    console.log(`\n【${source}】`);
    articles.slice(0, 10).forEach((a, i) => {
      console.log(`  ${i+1}. ${a.title}`);
      console.log(`     🔗 ${a.url}`);
    });
  }
}

scrapeAll().catch(console.error);
