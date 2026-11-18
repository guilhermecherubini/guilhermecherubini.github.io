import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('latest set section embeds the YouTube video with the given title', () => {
  assert.match(html, /<section id="latest-set">[\s\S]*?<\/section>/);
  const section = html.match(/<section id="latest-set">([\s\S]*?)<\/section>/)[1];
  assert.match(section, /KROZZ LIVE at\. KSA \| da lighT B2B CHERUBINI/);
  assert.match(section, /src="https:\/\/www\.youtube\.com\/embed\/8ZqvZB4006w"/);
  assert.match(section, /referrerpolicy="strict-origin-when-cross-origin"/);
  assert.match(section, /allowfullscreen/);
});

test('latest set section comes before the discography section', () => {
  assert.match(html, /id="latest-set"/);
  assert.match(html, /id="discography"/);
  assert.ok(html.indexOf('id="latest-set"') < html.indexOf('id="discography"'));
});

test('latest set link sends the latest_set_youtube GA4 event', () => {
  const section = html.match(/<section id="latest-set">([\s\S]*?)<\/section>/)[1];
  assert.match(section, /gtag\('event', 'latest_set_youtube', \{ 'screen_name': 'Guilherme Cherubini Landing Page' \}\)/);
  assert.match(section, /href="https:\/\/www\.youtube\.com\/watch\?v=8ZqvZB4006w"/);
});

test('latest set iframe keeps a 16:9 responsive ratio', () => {
  assert.match(css, /#latest-set iframe\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/);
});
