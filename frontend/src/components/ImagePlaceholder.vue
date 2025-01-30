<template>
  <svg
    :fill="props.fillColor"
    height="100%"
    width="100%"
    viewBox="0 0 455 455"
    xmlns="http://www.w3.org/2000/svg"
    class="svg-placeholder"
  >
    <g>
      <polygon points="266.498,191.677 305.833,220.011 334.904,199.072 266.503,125.164 198.102,199.072 227.168,220.01" />
      <polygon points="355.435,221.256 305.833,256.983 266.499,228.65 231.121,254.136 301.181,329.836 455,329.836 455,328.836" />
      <polygon points="0,329.836 260.305,329.836 130.153,189.205" />
    </g>
  </svg>
</template>

<script setup lang="ts">

const props = defineProps({
  fillColor: {
    type: String,
    default: '#000000'
  }
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.svg-placeholder {
  width: 96px;
  height: 96px;
}
</style>
