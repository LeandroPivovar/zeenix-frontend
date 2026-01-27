<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content video-card">
      <div class="modal-header">
        <h3 class="modal-title">Bem-vindo à Zenix!</h3>
        <button class="close-btn" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="video-container">
        <iframe 
          v-if="videoUrl"
          :src="videoUrl" 
          title="Vídeo Explicativo"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          class="video-iframe"
        ></iframe>
        <div v-else class="video-placeholder">
          <div class="placeholder-icon">
            <i class="fas fa-play d-none"></i>
            <span>Vídeo indisponível</span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  name: 'FirstAccessVideoModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // URL do vídeo explicativo (pode ser substituída por uma prop ou vinda da API)
      videoUrl: 'https://www.youtube.com/embed/K4kN_JdmqoY?si=1fgXH7T_nfOMXDiw' // Placeholder - Substituir pelo vídeo real
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001; /* Acima do Onboarding se necessário, mas será sequencial */
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.video-card {
  background: #0B0B0B;
  border: 1px solid rgba(34, 197, 94, 0.2); /* Borda verde suave */
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideUp 0.4s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #ffffff, #a0a0a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #9CA3AF;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: rotate(90deg);
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* Aspect Ratio 16:9 */
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #141414;
  color: #4B5563;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: #22C55E;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #16A34A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .video-card {
    padding: 20px;
  }
  
  .modal-title {
    font-size: 20px;
  }
}
</style>
