import { reactive } from 'vue';

const state = reactive({
    visible: false,
    title: '',
    message: '',
    type: 'alert', // 'alert' or 'confirm'
    resolve: null,
    confirmText: 'OK',
    cancelText: 'Cancelar'
});

export default {
    state,

    alert(message, title = 'Aviso', confirmText = 'OK') {
        return new Promise((resolve) => {
            state.title = title;
            state.message = message;
            state.type = 'alert';
            state.confirmText = confirmText;
            state.visible = true;
            state.resolve = resolve;
        });
    },

    confirm(message, title = 'Confirmação', confirmText = 'Sim', cancelText = 'Não') {
        return new Promise((resolve) => {
            state.title = title;
            state.message = message;
            state.type = 'confirm';
            state.confirmText = confirmText;
            state.cancelText = cancelText;
            state.visible = true;
            state.resolve = resolve;
        });
    },

    close(result) {
        state.visible = false;
        if (state.resolve) {
            state.resolve(result);
        }
        state.resolve = null;
    }
};
