<!-- AnimatedBorderButton.vue -->
<template>
  <Story>
    <AnimatedBorderButton />
  </Story>
</template>

<script setup lang="ts">
import AnimatedBorderButton from './AnimatedBorderButton.vue'
const props = withDefaults(defineProps<{
  label?: string
  width?: number     // px
  height?: number    // px
  textColor?: string
  borderColor?: string
  background?: string
}>(), {
  label: 'IDLE',
  width: 256,
  height: 64,
  textColor: '#fff',
  borderColor: 'rgba(255,255,255,0.5)',
  background: 'transparent'
})

const cssVars = {
  '--btn-w': props.width + 'px',
  '--btn-h': props.height + 'px',
  '--btn-text': props.textColor,
  '--btn-border': props.borderColor,
  '--btn-bg': props.background
} as Record<string, string>
</script>

<style scoped>
/* 僅必要樣式 */
.btn {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  width: var(--btn-w);
  height: var(--btn-h);
  line-height: 1;

  color: var(--btn-text);
  background: var(--btn-bg);

  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s;
}

.btn span {
  transition: all 0.3s;
  transform: scale(1, 1);
}

/* 邊框動畫需要的偽元素 */
.btn::before,
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  transition: all 0.3s;
}

/* 旋轉邊框（btn-two） */
.btn-two::before,
.btn-two::after {
  border: 1px solid var(--btn-border);
}

/* hover 後縮成中段並旋轉 */
.btn-two:hover::after,
.btn-two:hover::before {
  left: calc((var(--btn-w) - 64px) / 2);
  width: 64px;

  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.btn-two:hover::after {
  animation-name: rotatecw;
  animation-duration: 2s;
}
.btn-two:hover::before {
  animation-name: rotateccw;
  animation-duration: 3s;
}

@keyframes rotatecw {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes rotateccw {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
</style>
