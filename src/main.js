import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import DialogService from './services/DialogService'

// Override native alerts with custom dialogs
window.alert = DialogService.alert
window.confirm = DialogService.confirm

const app = createApp(App)

// Handler global de erros para capturar erros conhecidos do Vue durante desmontagem
app.config.errorHandler = (err, instance, info) => {
  const errorMessage = String(err?.message || err || '');
  const errorStack = String(err?.stack || '');
  const knownErrors = [
    'insertBefore',
    'Symbol(_assign)',
    'emitsOptions',
    '_assigning',
    'Cannot read properties of null',
    'Cannot set properties of null',
    'Cannot use \'in\' operator',
    'Cannot destructure property',
    'bum',
    'textContent',
    'nextSibling',
    'Symbol(_vtc)'
  ];

  const isKnownError = knownErrors.some(errKey =>
    errorMessage.includes(errKey) ||
    errorStack.includes(errKey) ||
    info?.includes(errKey)
  );

  // Se for erro conhecido, ignorar silenciosamente
  if (!isKnownError) {
    console.error('[Vue] Erro não tratado:', err, info);
  }
};

app.use(store).use(router).mount('#app')
