import { ref, watchEffect } from 'vue';

export function useTheme() {
  const tema = ref(localStorage.getItem('tema') || 'light');

  function toggleTema() {
    tema.value = tema.value === 'light' ? 'dark' : 'light';
  }

  watchEffect(() => {
    document.body.setAttribute('data-theme', tema.value);
    localStorage.setItem('tema', tema.value);
  });

  return {
    tema,
    toggleTema,
  };
}
