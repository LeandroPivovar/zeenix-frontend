<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button @click="closeModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div v-if="searchable" class="modal-search">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="searchPlaceholder"
            class="search-input"
          />
        </div>
        
        <div class="modal-body">
          <div v-if="filteredItems.length === 0" class="no-results">
            <i class="fas fa-inbox"></i>
            <p>Nenhum item encontrado</p>
          </div>
          
          <div v-else class="items-list">
            <button
              v-for="item in filteredItems"
              :key="item.value"
              @click="selectItem(item)"
              :class="[
                'item-button',
                { 'selected': selectedValue === item.value }
              ]"
            >
              <div class="item-content">
                <span class="item-label">{{ item.label }}</span>
                <span v-if="item.description" class="item-description">
                  {{ item.description }}
                </span>
              </div>
              <i v-if="selectedValue === item.value" class="fas fa-check item-check"></i>
            </button>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'SelectionModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true,
      // Format: [{ value: 'key', label: 'Display Name', description: 'Optional' }]
    },
    selectedValue: {
      type: String,
      default: null
    },
    searchable: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: 'Buscar...'
    }
  },
  data() {
    return {
      searchQuery: ''
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.items.filter(item => {
        const labelMatch = item.label.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        return labelMatch || descMatch;
      });
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
      this.closeModal();
    },
    closeModal() {
      this.searchQuery = '';
      this.$emit('close');
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // Reset search when modal opens
        this.searchQuery = '';
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      } else {
        // Restore body scroll
        document.body.style.overflow = '';
      }
    }
  },
  beforeUnmount() {
    // Cleanup
    document.body.style.overflow = '';
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000000;
  padding: 20px;
}

.modal-container {
  background: #0B0B0B;
  border: 1px solid #1A1A1A;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #1A1A1A;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #DFDFDF;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #888;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #1A1A1A;
  color: #DFDFDF;
}

.modal-search {
  padding: 16px 24px;
  border-bottom: 1px solid #1A1A1A;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-search i {
  color: #666;
  font-size: 14px;
}

.search-input {
  flex: 1;
  background: #0F0F0F;
  border: 1px solid #1A1A1A;
  border-radius: 8px;
  padding: 10px 12px;
  color: #DFDFDF;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #22C55E;
  background: #0B0B0B;
}

.search-input::placeholder {
  color: #666;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
}

.no-results i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-results p {
  margin: 0;
  font-size: 14px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  background: #0F0F0F;
  border: 1px solid #1A1A1A;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.item-button:hover {
  background: #1A1A1A;
  border-color: #22C55E;
  transform: translateX(4px);
}

.item-button.selected {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22C55E;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.item-label {
  color: #DFDFDF;
  font-size: 14px;
  font-weight: 500;
}

.item-description {
  color: #888;
  font-size: 12px;
}

.item-check {
  color: #22C55E;
  font-size: 16px;
  margin-left: 12px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #1A1A1A;
  display: flex;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #1A1A1A;
  border-radius: 8px;
  color: #DFDFDF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #1A1A1A;
  border-color: #22C55E;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Scrollbar */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #0B0B0B;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #1A1A1A;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #22C55E;
}
</style>

