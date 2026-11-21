<script setup>
import { useData } from 'vitepress'

const { page } = useData()

const siteUrl = 'https://wiki.camzy.tech'
const rel = (page.value?.relativePath || '').replace(/\.md$/, '').replace(/\/?index$/, '')
const pageUrl = siteUrl + '/' + rel.replace(/^\//, '')
const licenseUrl = 'https://creativecommons.org/licenses/by/4.0/deed.zh-hans'
</script>

<template>
  <section class="vp-doc-copyright">
    <h2 class="cc-title">版权所有</h2>
    <div class="vp-copyright">
      <span class="copyright-mask" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path fill="currentColor" d="M9 8c1.104 0 2.105.448 2.829 1.173l-1.414 1.413a2 2 0 1 0 0 2.828l1.413 1.414A4.001 4.001 0 0 1 5 12c0-2.208 1.792-4 4-4m9.829 1.173A4.001 4.001 0 0 0 12 12a4.001 4.001 0 0 0 6.828 2.828l-1.414-1.414a2 2 0 1 1 0-2.828zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16"/>
        </svg>
      </span>
      <p>
        <span class="cc-label">版权归属：</span>
        <span>喵科大团队</span>
      </p>
      <p>
        <span class="cc-label">本文链接：</span>
        <a class="cc-link" :href="pageUrl" target="_blank" rel="noopener noreferrer">{{ pageUrl }}</a>
      </p>
      <p>
        <span class="cc-label">许可证：</span>
        <a class="cc-link" :href="licenseUrl" target="_blank" rel="noopener noreferrer">署名 4.0 国际 (CC-BY-4.0)</a>
        <span class="vpi-license-cc" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path fill="currentColor" d="M9 8c1.104 0 2.105.448 2.829 1.173l-1.414 1.413a2 2 0 1 0 0 2.828l1.413 1.414A4.001 4.001 0 0 1 5 12c0-2.208 1.792-4 4-4m9.829 1.173A4.001 4.001 0 0 0 12 12a4.001 4.001 0 0 0 6.828 2.828l-1.414-1.414a2 2 0 1 1 0-2.828zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16"/>
          </svg>
        </span>
        <span class="vpi-license-by" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path fill="currentColor" d="M14 7a2 2 0 1 1-4 0a2 2 0 0 1 4 0m1 4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4h1.5v4h3v-4H15zm-3-9C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0a8 8 0 0 1-16 0"/>
          </svg>
        </span>
      </p>
    </div>
  </section>
</template>
