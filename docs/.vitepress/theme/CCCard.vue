<script setup>
import { useData } from 'vitepress'

const { page } = useData()

const siteUrl = 'https://wiki.camzy.tech'
const rel = (page.value?.relativePath || '').replace(/\.md$/, '').replace(/\/?index$/, '')
const pageUrl = siteUrl + '/' + rel.replace(/^\//, '')
const licenseUrl = 'https://creativecommons.org/licenses/by/4.0/deed.zh-hans'
</script>

<template>
  <aside class="cc-card">
    <div class="cc-watermark" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="6"/>
        <path d="M 34 60 A 14 14 0 0 1 34 40" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
        <path d="M 50 40 A 14 14 0 0 1 50 60" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      </svg>
    </div>

    <h4 class="cc-heading">版权所有</h4>
    <dl class="cc-fields">
      <div class="cc-row">
        <dt>版权归属：</dt>
        <dd>喵科大团队</dd>
      </div>
      <div class="cc-row">
        <dt>本文链接：</dt>
        <dd><a :href="pageUrl" target="_blank" rel="noopener noreferrer">{{ pageUrl }}</a></dd>
      </div>
      <div class="cc-row">
        <dt>许可证：</dt>
        <dd>
          <a :href="licenseUrl" target="_blank" rel="noopener noreferrer">署名 4.0 国际 (CC-BY-4.0)</a>
        </dd>
      </div>
    </dl>
  </aside>
</template>
