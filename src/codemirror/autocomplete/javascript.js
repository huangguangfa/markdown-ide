export const vueTemplate = `
\`\`\`vue
<template>
  <div>{{ name }}</div>
</template>

<script>
  export default {
    data(){
      return {
        name: 'test'
      }
    }
  }
</script>
\`\`\`
`

export const vueKeywords = [
  '<template>',
  'v-bind',
  'v-on',
  'v-model',
  'v-if',
  'v-for',
  'v-show',
  'v-cloak',
  'v-pre',
  'v-html',
  'v-text',
  '<style>',
  'scoped',
  ':class',
  ':style',
  'transition',
  'animation',
  'router-link',
  'router-view',
  'export default',
  'methods',
  'watch',
  'created',
  'mounted',
  'updated',
  'destroyed',
  'import',
  'mapState',
  'mapGetters',
  'mapActions',
  'mapMutations'
]


export const jsBaseKeywords = [
  'console.log()',
  'console.info()',
]
