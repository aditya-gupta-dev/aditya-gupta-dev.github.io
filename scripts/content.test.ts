import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { parsePortfolio } from '../src/content/schema.ts';
const root = new URL('../src/content/', import.meta.url);
const rawBook: unknown = JSON.parse(readFileSync(new URL('book.json',root),'utf8'));
const rawPages: Record<string, unknown> = Object.fromEntries(readdirSync(new URL('pages/',root)).filter(file=>file.endsWith('.json')).map(file=>[file,JSON.parse(readFileSync(new URL(`pages/${file}`,root),'utf8')) as unknown]));
const baseline = parsePortfolio(rawBook, rawPages);
const first = baseline.pages[0];
const withFirst = (page: unknown) => ({ ...rawPages, '01-title.json': page });

test('all authored content and references are valid',()=> {
  assert.equal(baseline.pages.length,12);
  assert.equal(baseline.chapters.length,6);
});
test('new pages, including odd page counts, are discovered without fixed navigation counts',()=> {
  const result=parsePortfolio(rawBook,{...rawPages,'13-example.json':{...first,id:'example',order:130,chapterId:'next-chapter'}});
  assert.equal(result.pages.length,13);
  assert.equal(result.pages.at(-1)?.id,'example');
});
test('errors pinpoint incorrect nested JSON values and unsupported styles',()=> {
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,blocks:[{type:'entry',title:'Test',meta:'Test',blocks:[{type:'paragraph',text:42}]}]})),/01-title.json.blocks\[0\].blocks\[0\].text/);
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,blocks:[{type:'paragraph',text:'Test',style:'typo'}]})),/style/);
});
test('unknown fields and unknown block types fail instead of disappearing silently',()=> {
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,footerLable:'typo'})),/unknown field/);
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,blocks:[{type:'video'}]})),/supported content block/);
});
test('duplicate ids/orders and missing references are rejected',()=> {
  assert.throws(()=>parsePortfolio(rawBook,{...rawPages,extra:first}),/Duplicate/);
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,chapterId:'missing'})),/unknown chapter/);
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,blocks:[{type:'page-link',label:'Go',pageId:'missing'}]})),/unknown page reference/);
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,blocks:[{type:'contents',title:'Index',chapterIds:['missing']}]})),/unknown chapter reference/);
});
test('links reject executable URLs and chapters stay contiguous',()=> {
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,blocks:[{type:'link',label:'Bad',href:'javascript:alert(1)'}]})),/https/);
  assert.throws(()=>parsePortfolio(rawBook,withFirst({...first,order:200})),/contiguous/);
});
