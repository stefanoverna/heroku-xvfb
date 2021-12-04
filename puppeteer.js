const { launch, getStream } = require('puppeteer-stream');
const fs = require('fs');

const runner = async (search) => {
  const file = fs.createWriteStream('/tmp/test.webm');

  let data = [];

  console.log('Opening browser');
  const browser = await launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  const stream = await getStream(page, {
    audio: false,
    video: true,
  });

  stream.pipe(file);

  async function cleanup() {
    try {
      console.log('Cleaning up instances');
      await stream.destroy();
      file.close();
      await page.close();
      await browser.close();
    } catch (e) {
      console.log('Cannot cleanup istances');
    }
  }

  try {
    console.log('Navigating url');
    await page.goto('https://duckduckgo.com/', { waitUntil: 'networkidle2' });
    console.log('Typing text');
    await page.type('input#search_form_input_homepage', search, { delay: 50 });
    await page.click('input#search_button_homepage');
    console.log('Wait for results');
    await page.waitForSelector('.results--main #r1-0');
    data = await page.evaluate(() =>
      [...document.querySelectorAll('a.result__a')].map((e) =>
        e.textContent.trim(),
      ),
    );
    await new Promise((res) => setTimeout(res, 2000));
    console.log('Extracted data');
    await cleanup();
  } catch (e) {
    console.log('Error happened', e);
    await page.screenshot({ path: '/tmp/error.png' });
    await cleanup();
  }
  return data;
};

module.exports = runner;
