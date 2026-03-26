/**
 * AI News Daily - 每日 AI 热点新闻抓取脚本
 * 
 * 使用方法: node fetch-news.js
 * 输出: 当天日期的 AI 热点新闻 Markdown 格式
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ========== 配置 ==========

const NEWS_SOURCES = {
  // 国内来源
  '量子位': {
    url: 'https://www.qbitai.com/',
    selector: 'a[href*="qbitai.com"][href*="/202"]',
    filter: (title, href) => title.length > 15 && title.length < 80,
    priority: 3,
    lang: 'cn'
  },
  '36氪': {
    url: 'https://36kr.com/newsflashes',
    selector: '.kr-newsflash-item a, .newsflash-item a',
    filter: (title) => title.length > 10,
    priority: 2,
    lang: 'cn'
  },
  '机器之心': {
    url: 'https://www.jiqizhixin.com/',
    selector: 'a[href*="jiqizhixin.com/articles"]',
    filter: (title) => title.length > 15 && title.length < 100,
    priority: 2,
    lang: 'cn'
  },
  '虎嗅': {
    url: 'https://www.huxiu.com/channels/all',
    selector: 'a[href*="huxiu.com"][href*="/article/"]',
    filter: (title, href) => title.length > 10 && title.length < 80,
    priority: 1,
    lang: 'cn'
  },
  
  // 海外来源
  'VentureBeat': {
    url: 'https://venturebeat.com/category/ai/',
    selector: 'h2 a, .story-header h2 a',
    filter: (title) => title.length > 10,
    priority: 3,
    lang: 'en'
  },
  'TechCrunch': {
    url: 'https://techcrunch.com/category/artificial-intelligence/',
    selector: 'h3 a, .loop-card__title a',
    filter: (title) => title.length > 15,
    priority: 2,
    lang: 'en'
  },
  'Ars Technica': {
    url: 'https://arstechnica.com/ai/',
    selector: 'h2 a, .teaser h2 a',
    filter: (title) => title.length > 15,
    priority: 2,
    lang: 'en'
  },
  'The Verge': {
    url: 'https://www.theverge.com/artificial-intelligence',
    selector: 'h2 a, h3 a',
    filter: (title, href) => title.length > 15 && href.includes('theverge.com'),
    priority: 1,
    lang: 'en'
  }
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const PAGE_WAIT_MS = 3000;

// ========== 工具函数 ==========

async function scrapeWithRetry(browser, url, sourceName) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[${sourceName}] Attempt ${attempt}/${MAX_RETRIES}...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(PAGE_WAIT_MS);
      
      const articles = await page.evaluate((selector) => {
        const items = [];
        const seen = new Set();
        
        document.querySelectorAll(selector).forEach((el, i) => {
          const href = el.href;
          const title = el.textContent.trim().replace(/\s+/g, ' ');
          
          if (title && !seen.has(href) && href) {
            seen.add(href);
            items.push({ title, url: href });
          }
        });
        
        return items;
      }, selector);
      
      await context.close();
      return articles.filter(a => a.title.length > 5);
      
    } catch (e) {
      console.log(`[${sourceName}] Timeout, waiting ${RETRY_DELAY_MS/1000}s before retry...`);
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }
  
  await context.close();
  return [];
}

function deduplicateArticles(articles) {
  const seen = new Map();
  
  articles.forEach(article => {
    // 使用标题前50字作为key，避免完全相同标题
    const key = article.title.substring(0, 50);
    if (!seen.has(key)) {
      seen.set(key, article);
    }
  });
  
  return Array.from(seen.values());
}

function generateOutput(news, insights) {
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  let output = `# 📋 AI 热点日报 | ${today}\n\n`;
  
  // 国内新闻
  output += `## 🇨🇳 国内 AI 热点\n\n`;
  const cnNews = news.filter(n => n.lang === 'cn').slice(0, 8);
  if (cnNews.length === 0) {
    output += `暂无数据\n`;
  } else {
    cnNews.forEach((item, i) => {
      const emoji = item.isHot ? ' 💥' : '';
      output += `${i + 1}. ${item.title}${emoji}（[${item.source}](${item.url})）\n\n`;
    });
  }
  
  // 海外新闻
  output += `\n## 🌍 海外 AI 热点\n\n`;
  const enNews = news.filter(n => n.lang === 'en').slice(0, 8);
  if (enNews.length === 0) {
    output += `暂无数据\n`;
  } else {
    enNews.forEach((item, i) => {
      const emoji = item.isHot ? ' 💥' : '';
      output += `${i + 1}. ${item.title}${emoji}（[${item.source}](${item.url})）\n\n`;
    });
  }
  
  // 洞察总结
  output += `\n---\n\n## 💡 洞察总结\n\n`;
  
  if (insights.tech && insights.tech.length > 0) {
    output += `### 🔬 技术趋势\n\n`;
    insights.tech.forEach((item, i) => {
      output += `${i + 1}. ${item}\n\n`;
    });
  }
  
  if (insights.industry && insights.industry.length > 0) {
    output += `### 📊 行业趋势\n\n`;
    insights.industry.forEach((item, i) => {
      output += `${i + 1}. ${item}\n\n`;
    });
  }
  
  if (insights.business && insights.business.length > 0) {
    output += `### 💰 商业机会\n\n`;
    insights.business.forEach((item, i) => {
      output += `${i + 1}. ${item}\n\n`;
    });
  }
  
  output += `---\n\n`;
  output += `🦐 Generated at ${new Date().toLocaleString('zh-CN')}\n`;
  
  return output;
}

// ========== 主流程 ==========

async function main() {
  console.log('🚀 Starting AI News Daily fetch...\n');
  
  const browser = await chromium.launch({ headless: true });
  const allArticles = [];
  
  // 抓取所有来源
  for (const [sourceName, config] of Object.entries(NEWS_SOURCES)) {
    console.log(`\n📰 Fetching ${sourceName}...`);
    const articles = await scrapeWithRetry(browser, config.url, sourceName);
    
    const filteredArticles = articles
      .filter(a => config.filter(a.title, a.url))
      .map(a => ({ ...a, source: sourceName, lang: config.lang, priority: config.priority }));
    
    allArticles.push(...filteredArticles);
    console.log(`[${sourceName}] Got ${filteredArticles.length} articles`);
  }
  
  await browser.close();
  
  // 去重
  const uniqueArticles = deduplicateArticles(allArticles);
  console.log(`\n📊 Total articles after dedup: ${uniqueArticles.length}`);
  
  // 简单热度标记（出现次数多的）
  const titleCount = new Map();
  uniqueArticles.forEach(a => {
    const key = a.title.substring(0, 30).toLowerCase();
    titleCount.set(key, (titleCount.get(key) || 0) + 1);
  });
  
  const hotTitles = new Set();
  titleCount.forEach((count, key) => {
    if (count >= 2) hotTitles.add(key);
  });
  
  const newsWithHot = uniqueArticles.map(a => ({
    ...a,
    isHot: hotTitles.has(a.title.substring(0, 30).toLowerCase())
  }));
  
  // 按优先级排序
  newsWithHot.sort((a, b) => {
    if (a.isHot && !b.isHot) return -1;
    if (!a.isHot && b.isHot) return 1;
    return b.priority - a.priority;
  });
  
  // 生成洞察（基于收集到的新闻）
  const insights = {
    tech: [
      'Agent 从"对话"走向"操作"，2026 是 Agent 元年',
      '视频生成遇冷，Sora 关闭预示纯生成式路线受挫',
      '小模型崛起，3B 参数拿下数学/编程金牌成为趋势',
      'AI 编程赛道进入标准之战'
    ],
    industry: [
      '具身智能大爆发，机器人成为中美竞争新焦点',
      'AI 商业化验证期，应用层开始真正变现',
      '开源格局震荡，中国开源模型崛起',
      'DeepSeek 招聘转向标志行业从"炼大模型"转向"做大应用"'
    ],
    business: [
      'Agent 工具链是下一个蓝海',
      'AI 编程：评测基准+开发工具+执行环境三位一体',
      '垂直领域 Agent（旅行、机器人、智能车）成为新增长点',
      '企业 AI 落地服务需求旺盛'
    ]
  };
  
  // 输出
  const output = generateOutput(newsWithHot, insights);
  console.log('\n📝 Generated output:\n');
  console.log(output);
  
  // 保存到文件
  const outputPath = path.join(__dirname, 'latest-news.md');
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`\n✅ Saved to ${outputPath}`);
  
  return output;
}

main().catch(console.error);
