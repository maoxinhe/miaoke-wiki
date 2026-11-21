<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import CCCard from './CCCard.vue'
import ChangelogCard from './ChangelogCard.vue'
import NotFound404 from './NotFound.vue'

const { frontmatter } = useData()

const isHome = () => {
  const f = frontmatter.value
  return !!f && (f.layout === 'home' || (f.hero && f.hero.name))
}
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <ChangelogCard v-if="!isHome()" />
      <CCCard v-if="!isHome()" />
    </template>
    <template #not-found>
      <NotFound404 />
    </template>
  </DefaultTheme.Layout>
</template>
