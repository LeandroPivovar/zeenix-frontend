<template>
    <div v-if="visible" class="dev-modal-overlay" @click.self="$emit('close')">
        <div class="dev-modal-content">
            <div class="dev-modal-header">
                <i class="fa-solid fa-screwdriver-wrench text-zenix-green text-4xl mb-4"></i>
                <h2>{{ entityType }} em desenvolvimento</h2>
            </div>
            <div class="dev-modal-body">
                <p>{{ message }}</p>
                <p class="mt-2 text-sm opacity-70">Logo quando terminarmos você será avisado!</p>
            </div>
            <button class="dev-modal-button" @click="$emit('close')">Entendi</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ImplementationModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        entityType: {
            type: String,
            default: 'IA' // 'IA' or 'Agente'
        },
        message: {
            type: String,
            default: 'Ainda está sendo implementado e será liberado entre segunda e sexta da próxima semana.'
        }
    }
};
</script>

<style scoped>
.dev-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999990000 !important;
    backdrop-filter: blur(4px);
}

.dev-modal-content {
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 2px solid #22C55E;
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(34, 197, 94, 0.3);
}

.dev-modal-header {
    margin-bottom: 1.5rem;
}

.dev-modal-header h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
    margin: 0;
}

.dev-modal-body {
    color: #d1d5db;
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.dev-modal-button {
    background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
}

.dev-modal-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .dev-modal-content {
        padding: 1.5rem;
        max-width: 95%;
    }

    .dev-modal-header h2 {
        font-size: 1.25rem;
    }

    .dev-modal-body {
        font-size: 0.9rem;
    }

    .dev-modal-button {
        padding: 0.65rem 1.5rem;
        font-size: 0.9rem;
    }
}
</style>
