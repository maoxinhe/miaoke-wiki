<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const fmt = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// lastUpdated 挂在页面数据上（毫秒时间戳）；挂载后回填，规避首屏 hydration 时机
// lastUpdated 挂在页面数据上（毫秒时间戳）；挂载后回填，规避首屏 hydration 时机
const latest = ref(page.value?.lastUpdated ?? null)
onMounted(() => {
  latest.value = page.value?.lastUpdated ?? null
})

// 预留：可在页面 frontmatter 注入 changelog: [{ hash, message, date }]
const entries = computed(() => frontmatter.value?.changelog || [])
</script>

<template>
  <section class="vp-doc-changelog">
    <h2 class="cc-title">更新日志</h2>
    <div class="vp-changelog-wrapper">
      <div class="vp-changelog-header">
        <div class="vp-latest-updated">
          <svg class="cc-icon" viewBox="0 0 16 16" width="1.2em" height="1.2em" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M2.71 10.96a6.5 6.5 0 1 0-.69-3.53M2 8l1.5-1.5M2 8L.5 6.5m8 2v-4m0 4h3"/>
          </svg>
          <span v-if="latest">{{ fmt(latest) }}</span>
          <span v-else>暂无更新记录</span>
        </div>
        <div class="vp-changelog-all">
          <svg class="cc-icon" viewBox="0 0 24 24" width="1.2em" height="1.2em" aria-hidden="true">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M4 5h0.01"/><path d="M8 5h12"/>
              <path d="M4 10h0.01"/><path d="M8 10h12"/>
              <path d="M4 15h0.01"/><path d="M8 15h12"/>
            </g>
          </svg>
          <span>查看所有更新日志</span>
        </div>
      </div>
      <ul class="vp-changelog-list" v-if="entries.length">
        <li class="vp-changelog-item-commit" v-for="(e, i) in entries" :key="i">
          <span class="vp-changelog-hash"><code>{{ e.hash }}</code></span>
          <span class="vp-changelog-divider">-</span>
          <span class="vp-changelog-message">{{ e.message }}</span>
          <span class="vp-changelog-date">于 {{ e.date }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
