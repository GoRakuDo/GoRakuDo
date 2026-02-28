/**
 * viewport-animation.ts
 * ビューポート内に入ったときだけアニメーションを有効にする最適化スクリプト
 * 
 * 対象: .animate-pulse, .animate-float, .animate-pulse-slow, .animate-bounce-subtle, .animate-spin-slow
 * 効果: 画面外の要素のアニメーションを停止し、GPU/CPUリソースを節約する (KISS / SOLID:SRP)
 */

document.addEventListener('DOMContentLoaded', () => {
 // ユーザーが「視差効果を減らす」を設定している場合は何もしない
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  return;
 }

 const observer = new IntersectionObserver(
  (entries) => {
   for (const entry of entries) {
    const el = entry.target as HTMLElement;
    if (entry.isIntersecting) {
     el.style.animationPlayState = 'running';
    } else {
     el.style.animationPlayState = 'paused';
    }
   }
  },
  { rootMargin: '100px' } // 100px先読みしてアニメーション開始
 );

 const animatedElements = document.querySelectorAll<HTMLElement>(
  '.animate-pulse, .animate-float, .animate-pulse-slow, .animate-bounce-subtle, .animate-spin-slow, .animate-bounce-in, .animate-shake, .animate-progress-bar'
 );

 animatedElements.forEach((el) => {
  // 初期状態は停止
  el.style.animationPlayState = 'paused';
  observer.observe(el);
 });
});
