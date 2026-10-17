<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import CCCard from './CCCard.vue'

const { frontmatter } = useData()

const isHome = () => {
  const f = frontmatter.value
  return !!f && (f.layout === 'home' || (f.hero && f.hero.name))
}
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <CCCard v-if="!isHome()" />
    </template>
  </DefaultTheme.Layout>
</template>
