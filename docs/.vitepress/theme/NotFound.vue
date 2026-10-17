<template>
  <div class="mzy-404">
    <p class="mzy-404-code">404</p>
    <p class="mzy-404-title">页面不存在</p>
    <p class="mzy-404-desc">你访问的页面可能已被移除、改名或地址有误。<br />如有疑问，可在「运维手册 / 基础问题解答」中查找对应内容。</p>
    <a class="mzy-404-link" href="/">返回首页</a>
  </div>
</template>

<style scoped>
.mzy-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 96px 24px 120px;
  min-height: 52vh;
}
.mzy-404-code {
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.06em;
  color: var(--vp-c-brand-1);
  margin: 0;
}
.mzy-404-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 18px 0 0;
}
.mzy-404-desc {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  max-width: 480px;
  margin: 14px auto 0;
}
.mzy-404-link {
  display: inline-block;
  margin-top: 28px;
  padding: 0.6rem 1.8rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #ffffff;
  background: var(--vp-c-brand-1);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s ease;
}
.mzy-404-link:hover {
  background: var(--vp-c-brand-2);
}
</style>
