<template>
  <article-detail :is-edit='true'></article-detail>
</template>

<script>
import ArticleDetail from './components/OnarticleDetail'

export default {
  name: 'editForm',
  components: { ArticleDetail }
}
</script>

