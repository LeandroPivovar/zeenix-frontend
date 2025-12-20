<template>
    <div class="dashboard-layout" ref="layoutContainer">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" :is-mobile="isMobile" @toggle-collapse="toggleSidebarCollapse" @close-sidebar="isSidebarOpen = false" />
        
        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                v-if="!isMobile"
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
            />
            
            <div v-if="isMobile" class="mobile-header-admin">
                <button class="menu-toggler-btn" @click="isSidebarOpen = true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="mobile-brand">
                    <span class="text-white font-bold text-lg">ZEN</span><span class="text-white font-bold text-lg">I</span><span class="text-[#22C55E] font-bold text-lg">X</span>
                </div>
            </div>

            <main class="layout-content">
            
            <div class="form-support-item" v-if="isFormVisible">
                <form @submit.prevent="saveSupportItem">
                    <div class="header-form">
                        <h1>{{ isEditing ? 'Editar Item de Suporte' : 'Adicionar novo Item de Suporte' }}</h1>
                        <a href="#" class="help-link">Ajuda</a>
                        <button class="close-btn" type="button" @click="closeForm">×</button>
                    </div>
                    <p>Adicione informações sobre o item de suporte</p>

                    <div class="form-container">
                        <div class="form-group" style="flex: 1 1 100%;">
                            <label for="title">Título</label>
                            <input type="text" id="title" name="title" placeholder="ex: Como conectar minha conta" v-model="supportItemForm.title" required>
                            <span class="hint-text">Título do item de suporte.</span>
                        </div>

                        <div class="form-group" style="flex: 1 1 100%;">
                            <label for="subtitle">Descrição</label>
                            <div ref="editorContainer" class="quill-editor-container"></div>
                            <span class="hint-text">Descrição do item de suporte. Use a barra de ferramentas para formatar o texto e adicionar imagens.</span>
                            <input
                                type="file"
                                ref="inlineImageInput"
                                @change="handleInlineImageUpload"
                                accept="image/*"
                                style="display: none;"
                            />
                        </div>

                        <div class="divisor"></div>

                        <div class="footer-form">
                            <div class="right-footer">
                                <h3>&nbsp;</h3>
                            </div>
                            <div class="left-footer">
                                <button class="cancel-btn" type="button" @click="closeForm">Cancelar</button>
                                <button class="save-btn" type="submit">{{ isEditing ? 'Salvar Alterações' : 'Adicionar Item' }}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="add-support-item-button-wrapper" v-if="!isFormVisible">
                <button class="add-support-item-btn" @click="openForm">
                    + Adicionar Novo Item de Suporte
                </button>
            </div>
            
            <div class="support-items-table">
                <div class="table-content-wrapper">
                    <div class="table-header">
                        <div class="th title">Título</div>
                        <div class="th subtitle">Descrição</div>
                        <div class="th created-at">Data de Criação</div>
                        <div class="th actions">Ações</div>
                    </div>
                    <div class="table-body">
                        <div v-if="isLoading" class="table-row-support-items">
                            <div class="td" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
                                Carregando itens de suporte...
                            </div>
                        </div>
                        <div v-else-if="supportItems.length === 0" class="table-row-support-items">
                            <div class="td" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
                                Nenhum item de suporte cadastrado
                            </div>
                        </div>
                        <div v-else class="table-row-support-items" v-for="item in supportItems" :key="item.id">
                            <div class="td title">{{ item.title }}</div>
                            <div class="td subtitle-preview" v-html="getSubtitlePreview(item.subtitle)"></div>
                            <div class="td created-at">{{ formatDate(item.createdAt) }}</div>
                            <div class="td actions">
                                <button class="action-btn edit" aria-label="Editar" @click="editSupportItem(item)"><i class="fas fa-edit"></i></button>
                                <button class="action-btn trash" aria-label="Deletar" @click="deleteSupportItem(item.id)"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-view">
            </div>
            </main>
        </div>
        <ToastNotification ref="toast" />
    </div>
</template>

<script>
/* eslint-disable no-undef */
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import ToastNotification from '../../components/Toast.vue';

// Quill é carregado via CDN no index.html, então é uma variável global

export default {
    name: 'SupportItemsManagementView',
    components: {
        AppSidebar,
        TopNavbar,
        ToastNotification,
    },
    data() {
        return {
            isSidebarOpen: true, 
            isSidebarCollapsed: false,
            isMobile: false,
            
            // Gerenciamento do Formulário
            isFormVisible: false,
            isEditing: false,
            supportItemForm: this.getEmptySupportItemForm(),
            
            // Dados Dinâmicos
            supportItems: [],
            isLoading: true,
            
            // Editor
            quillEditor: null,
        };
    },
    async mounted() {
        this.checkMobileStatus();
        window.addEventListener('resize', this.checkMobileStatus);
        document.addEventListener('click', this.handleClickOutside);
        await this.loadSupportItems();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobileStatus);
        document.removeEventListener('click', this.handleClickOutside);
        if (this.quillEditor) {
            this.quillEditor = null;
        }
    },
    methods: {
        // --- Métodos de Toast ---
        showToast(message, type = 'info', duration = 5000) {
            if (this.$refs.toast) {
                if (type === 'success') {
                    this.$refs.toast.success(message, duration);
                } else if (type === 'error') {
                    this.$refs.toast.error(message, duration);
                } else if (type === 'warning') {
                    this.$refs.toast.warning(message, duration);
                } else {
                    this.$refs.toast.info(message, duration);
                }
            }
        },
        
        // --- Métodos de Integração com Backend ---
        async loadSupportItems() {
            this.isLoading = true;
            try {
                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = `${baseUrl}/support/items`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = `Falha ao carregar itens de suporte: ${response.status} ${response.statusText}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                this.supportItems = data;
            } catch (error) {
                console.error('Erro ao carregar itens de suporte:', error);
                this.showToast('❌ Erro ao carregar itens de suporte', 'error', 6000);
                this.supportItems = [];
            } finally {
                this.isLoading = false;
            }
        },

        getSubtitlePreview(subtitle) {
            if (!subtitle) return '-';
            // Remove tags HTML e limita a 150 caracteres
            const text = subtitle.replace(/<[^>]*>/g, '').trim();
            return text.length > 150 ? text.substring(0, 150) + '...' : text || '-';
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },

        // --- Métodos de Utilitário ---
        getEmptySupportItemForm() {
            return {
                id: null,
                title: '',
                subtitle: '',
            };
        },

        // --- Métodos de Gerenciamento de Formulário (CRUD) ---
        openForm() {
            this.supportItemForm = this.getEmptySupportItemForm();
            this.isEditing = false;
            this.isFormVisible = true;
            this.$nextTick(() => {
                this.initQuillEditor();
            });
        },
        closeForm() {
            this.isFormVisible = false;
            if (this.quillEditor) {
                // Limpar conteúdo do editor
                if (this.$refs.editorContainer) {
                    this.$refs.editorContainer.innerHTML = '';
                }
                this.quillEditor = null;
            }
        },
        initQuillEditor() {
            if (!this.$refs.editorContainer) {
                // Tentar novamente após um pequeno delay
                setTimeout(() => {
                    if (this.$refs.editorContainer) {
                        this.initQuillEditor();
                    }
                }, 100);
                return;
            }
            
            // Limpar editor anterior se existir
            if (this.quillEditor) {
                try {
                    this.quillEditor = null;
                } catch (e) {
                    console.warn('Erro ao limpar editor anterior:', e);
                }
            }
            
            // Limpar container
            this.$refs.editorContainer.innerHTML = '';
            
            // Verificar se Quill está disponível
            if (typeof Quill === 'undefined') {
                console.error('Quill não está carregado. Verifique se o CDN está incluído no index.html');
                this.showToast('Erro ao carregar o editor. Recarregue a página.', 'error', 5000);
                return;
            }
            
            try {
                // Criar novo editor Quill
                this.quillEditor = new Quill(this.$refs.editorContainer, {
                    theme: 'snow',
                    modules: {
                        toolbar: {
                            container: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'color': [] }, { 'background': [] }],
                                ['link', 'image'],
                                ['clean']
                            ],
                            handlers: {
                                image: () => {
                                    this.insertImage();
                                }
                            }
                        }
                    },
                    placeholder: 'Digite a descrição do item de suporte...'
                });
                
                // Carregar conteúdo se estiver editando
                if (this.supportItemForm.subtitle) {
                    // Processar URLs de imagens no conteúdo HTML antes de carregar
                    const processedContent = this.processImageUrls(this.supportItemForm.subtitle);
                    this.quillEditor.root.innerHTML = processedContent;
                    
                    // Forçar atualização das imagens após carregar
                    this.$nextTick(() => {
                        this.fixQuillImages();
                    });
                }
                
                // Atualizar o v-model quando o conteúdo mudar
                this.quillEditor.on('text-change', () => {
                    if (this.quillEditor) {
                        this.supportItemForm.subtitle = this.quillEditor.root.innerHTML;
                        // Corrigir imagens após mudanças
                        this.$nextTick(() => {
                            this.fixQuillImages();
                        });
                    }
                });
                
                // Listener para quando imagens são inseridas
                this.quillEditor.root.addEventListener('DOMNodeInserted', (event) => {
                    if (event.target.tagName === 'IMG') {
                        this.$nextTick(() => {
                            this.fixQuillImages();
                        });
                    }
                });
            } catch (error) {
                console.error('Erro ao inicializar Quill:', error);
                this.showToast('Erro ao inicializar o editor. Tente novamente.', 'error', 5000);
            }
        },
        fixQuillImages() {
            if (!this.quillEditor) return;
            
            const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
            // O backend serve arquivos estáticos em /api/uploads/ devido ao prefixo global
            
            // Encontrar todas as imagens no editor
            const images = this.quillEditor.root.querySelectorAll('img');
            console.log(`Encontradas ${images.length} imagens no editor`);
            
            images.forEach((img, index) => {
                let src = img.getAttribute('src') || img.src;
                if (!src) {
                    console.warn(`Imagem ${index} sem src`);
                    return;
                }
                
                console.log(`Processando imagem ${index}:`, src);
                
                // Se já é URL completa ou data URI, apenas garantir estilos
                if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.display = 'block';
                    img.style.margin = '10px 0';
                    img.style.borderRadius = '4px';
                    return;
                }
                
                // Se é um caminho relativo, construir URL completa
                // O backend serve em /api/uploads/
                let fullUrl;
                if (src.startsWith('/uploads/')) {
                    fullUrl = `${baseUrl}${src}`;
                } else if (src.startsWith('uploads/')) {
                    fullUrl = `${baseUrl}/${src}`;
                } else {
                    fullUrl = `${baseUrl}/uploads/${src}`;
                }
                
                console.log('Corrigindo URL de imagem:', { original: src, fullUrl, apiBase });
                
                // Atualizar src apenas se for diferente
                if (img.src !== fullUrl) {
                    img.src = fullUrl;
                }
                
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '10px 0';
                img.style.borderRadius = '4px';
                
                // Adicionar handler de erro para debug
                img.onerror = (e) => {
                    console.error('Erro ao carregar imagem:', { fullUrl, src, error: e });
                    this.showToast(`Erro ao carregar imagem: ${fullUrl}`, 'error', 5000);
                };
                
                // Handler de sucesso
                img.onload = () => {
                    console.log('Imagem carregada com sucesso:', fullUrl);
                };
            });
        },
        async saveSupportItem() {
            // Validações básicas
            if (!this.supportItemForm.title || !this.supportItemForm.title.trim()) {
                this.showToast('⚠️ Por favor, preencha o título do item', 'warning', 4000);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    this.showToast('❌ Você precisa estar autenticado para realizar esta ação.<br><br>Por favor, faça login novamente.', 'error', 6000);
                    return;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = this.isEditing
                    ? `${baseUrl}/support/items/${this.supportItemForm.id}`
                    : `${baseUrl}/support/items`;

                const method = this.isEditing ? 'PUT' : 'POST';

                // Obter conteúdo do editor Quill
                let subtitleContent = null;
                if (this.quillEditor) {
                    subtitleContent = this.quillEditor.root.innerHTML.trim();
                    // Normalizar URLs de imagens antes de salvar (remover baseUrl se existir)
                    subtitleContent = this.normalizeImageUrlsForSave(subtitleContent);
                } else if (this.supportItemForm.subtitle) {
                    subtitleContent = this.supportItemForm.subtitle.trim();
                    subtitleContent = this.normalizeImageUrlsForSave(subtitleContent);
                }
                
                const payload = {
                    title: this.supportItemForm.title.trim(),
                    subtitle: subtitleContent || null,
                };

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'Erro ao salvar item de suporte';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        if (errorText) {
                            errorMessage = errorText;
                        } else {
                            errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                        }
                    }
                    
                    if (response.status === 401) {
                        this.showToast('❌ Não autorizado! Seu token pode ter expirado.<br><br>Por favor, faça login novamente.', 'error', 7000);
                    } else if (response.status === 400) {
                        this.showToast(`❌ Erro de validação:<br>${errorMessage}`, 'error', 6000);
                    } else if (response.status >= 500) {
                        this.showToast(`❌ Erro no servidor:<br>${errorMessage}<br><br>Verifique os logs do backend.`, 'error', 8000);
                    } else {
                        this.showToast(`❌ Erro ao salvar item:<br>${errorMessage}`, 'error', 6000);
                    }
                    throw new Error(errorMessage);
                }

                await response.json();
                this.closeForm();
                await this.loadSupportItems();
                this.showToast(this.isEditing ? 'Item de suporte atualizado com sucesso!' : 'Item de suporte adicionado com sucesso!', 'success', 4000);
            } catch (error) {
                console.error('Erro ao salvar item de suporte:', error);
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    this.showToast('❌ Erro de conexão com o backend!<br><br>Verifique:<br>1. Se o backend está rodando (http://localhost:3000)<br>2. Se há problemas de CORS<br>3. Se a URL está correta', 'error', 8000);
                } else if (!error.message.includes('HTTP') && !error.message.includes('não autorizado')) {
                    this.showToast(error.message || '❌ Erro ao salvar item de suporte. Verifique os dados e tente novamente.', 'error', 6000);
                }
            }
        },
        editSupportItem(item) {
            this.supportItemForm = { 
                id: item.id,
                title: item.title,
                subtitle: item.subtitle || '',
            };
            this.isEditing = true;
            this.isFormVisible = true;
            // Inicializar editor com conteúdo após o DOM ser atualizado
            this.$nextTick(() => {
                this.initQuillEditor();
            });
        },
        insertImage() {
            this.$refs.inlineImageInput.click();
        },
        async handleInlineImageUpload(event) {
            const file = event.target.files[0];
            if (!file) {
                return;
            }
            
            // Mostrar loading
            this.showToast('📤 Fazendo upload da imagem...', 'info', 2000);
            
            // Fazer upload
            const uploadedPath = await this.uploadImage(file);
            if (uploadedPath && this.quillEditor) {
                console.log('Caminho recebido do upload:', uploadedPath);
                // Inserir imagem no editor Quill
                this.insertImageIntoQuill(uploadedPath);
                this.showToast('✅ Imagem adicionada com sucesso!', 'success', 3000);
            } else if (!uploadedPath) {
                this.showToast('❌ Falha ao fazer upload da imagem', 'error', 5000);
            }
            event.target.value = '';
        },
        insertImageIntoQuill(imagePath) {
            if (!this.quillEditor) {
                console.error('Quill editor não está inicializado');
                return;
            }
            
            const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
            // Construir URL completa da imagem
            // O NestJS serve arquivos estáticos em /api/uploads/ devido ao prefixo global
            let fullImageUrl;
            
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                // URL já é completa
                fullImageUrl = imagePath;
            } else if (imagePath.startsWith('/uploads/')) {
                // Caminho relativo, construir URL completa
                // O backend serve em /api/uploads/, então usamos baseUrl diretamente
                fullImageUrl = `${baseUrl}${imagePath}`;
            } else {
                // Caminho sem barra inicial
                fullImageUrl = `${baseUrl}/uploads/${imagePath}`;
            }
            
            console.log('Inserindo imagem no Quill:', { imagePath, fullImageUrl, baseUrl });
            
            // Obter a posição do cursor
            const range = this.quillEditor.getSelection(true);
            const index = range ? range.index : this.quillEditor.getLength();
            
            // Criar um elemento img para testar se a URL está correta
            const testImg = new Image();
            testImg.onload = () => {
                console.log('Imagem carregada com sucesso, inserindo no Quill:', fullImageUrl);
                // Inserir a imagem com URL completa usando insertEmbed
                this.quillEditor.insertEmbed(index, 'image', fullImageUrl, 'user');
                
                // Mover o cursor após a imagem
                this.quillEditor.setSelection(index + 1);
                
                // Forçar atualização visual após um pequeno delay
                setTimeout(() => {
                    this.fixQuillImages();
                }, 200);
            };
            testImg.onerror = () => {
                console.error('Erro ao carregar imagem de teste:', fullImageUrl);
                // Mesmo assim, tentar inserir
                this.quillEditor.insertEmbed(index, 'image', fullImageUrl, 'user');
                this.quillEditor.setSelection(index + 1);
                setTimeout(() => {
                    this.fixQuillImages();
                }, 200);
            };
            testImg.src = fullImageUrl;
        },
        processImageUrls(htmlContent) {
            if (!htmlContent) return '';
            
            const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
            // O backend serve arquivos estáticos em /api/uploads/ devido ao prefixo global
            
            // Processar todas as tags img no HTML para exibição
            return htmlContent.replace(/<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi, (match, before, src, after) => {
                // Se a URL já é completa (http/https), manter como está
                if (src.startsWith('http://') || src.startsWith('https://')) {
                    return match;
                }
                
                // Se começa com /uploads, adicionar baseUrl (que já inclui /api)
                if (src.startsWith('/uploads/')) {
                    const fullUrl = `${baseUrl}${src}`;
                    return `<img${before}src="${fullUrl}"${after} style="max-width: 100%; height: auto; display: block; margin: 10px 0; border-radius: 4px;">`;
                }
                
                // Se não começa com /, adicionar /uploads/ e baseUrl
                const fullUrl = `${baseUrl}/uploads/${src}`;
                return `<img${before}src="${fullUrl}"${after} style="max-width: 100%; height: auto; display: block; margin: 10px 0; border-radius: 4px;">`;
            });
        },
        normalizeImageUrlsForSave(htmlContent) {
            if (!htmlContent) return '';
            
            const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
            const apiBase = baseUrl.replace('/api', '');
            
            // Remover baseUrl das URLs antes de salvar, mantendo apenas o caminho relativo
            return htmlContent.replace(/<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi, (match, before, src, after) => {
                // Se contém o baseUrl, remover
                if (src.includes(apiBase)) {
                    const relativePath = src.replace(apiBase, '');
                    return `<img${before}src="${relativePath}"${after}>`;
                }
                
                // Se já é relativo, manter
                if (src.startsWith('/uploads/')) {
                    return match;
                }
                
                // Se é URL completa de outro domínio, manter
                if (src.startsWith('http://') || src.startsWith('https://')) {
                    return match;
                }
                
                // Caso contrário, manter como está
                return match;
            });
        },
        async uploadImage(file) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.showToast('❌ Você precisa estar autenticado para fazer upload', 'error', 5000);
                    return null;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const formData = new FormData();
                formData.append('file', file);

                console.log('Fazendo upload de imagem para:', `${baseUrl}/support/items/upload/image`);

                const response = await fetch(`${baseUrl}/support/items/upload/image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'Erro ao fazer upload da imagem';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || `Erro HTTP ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log('Upload bem-sucedido, caminho retornado:', result.path);
                return result.path;
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error);
                this.showToast(error.message || '❌ Erro ao fazer upload da imagem', 'error', 6000);
                return null;
            }
        },
        async deleteSupportItem(itemId) {
            const item = this.supportItems.find(i => i.id === itemId);
            if (!confirm(`Tem certeza que deseja deletar o item "${item?.title || itemId}"?`)) {
                return;
            }

            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    this.showToast('❌ Você precisa estar autenticado para realizar esta ação', 'error', 5000);
                    return;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = `${baseUrl}/support/items/${itemId}`;

                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'Erro ao deletar item de suporte';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || `Erro HTTP ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }

                await this.loadSupportItems();
                this.showToast('✅ Item de suporte deletado com sucesso!', 'success', 4000);
            } catch (error) {
                console.error('Erro ao deletar item de suporte:', error);
                this.showToast(error.message || '❌ Erro ao deletar item de suporte', 'error', 6000);
            }
        },

        // --- Métodos de Sidebar e Responsividade ---
        checkMobileStatus() {
            this.isMobile = window.innerWidth <= 768;
            
            if (!this.isMobile) {
                this.isSidebarOpen = true;
            } else {
                this.isSidebarOpen = false;
            }
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        toggleSidebar() { 
            if (this.isMobile) {
                this.isSidebarOpen = !this.isSidebarOpen;
            } else {
                this.toggleSidebarCollapse();
            }
        },
        handleClickOutside(event) {
            if (this.isMobile && this.isSidebarOpen) {
                const sidebarEl = this.$refs.layoutContainer.querySelector('.app-sidebar'); 
                const isClickOutsideSidebar = sidebarEl && !sidebarEl.contains(event.target);
                const isClickOnHamburger = event.target.closest('.hamburger-btn');
                
                if (isClickOutsideSidebar && !isClickOnHamburger) {
                    this.isSidebarOpen = false;
                }
            }
        },
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
    color: #fff;
    font-family: 'Roboto', sans-serif;
    margin: 0;
}

/* Layout Base - Padrão Dashboard */
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #0B0B0B;
    color: #fff;
}

.sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.dashboard-content-wrapper {
    flex-grow: 1;
    margin-left: 280px;
    transition: margin-left 0.3s ease;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 80px;
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    padding-top: 50px;
    background-color: #0B0B0B;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

/* Mobile Header */
.mobile-header-admin {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #0b0b0b;
    z-index: 998;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #1C1C1C;
}

.mobile-brand {
    display: flex;
    align-items: center;
}

.menu-toggler-btn {
    background-color: #1e1e1e;
    color: rgb(255, 255, 255);
    border: 1px solid #333;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.menu-toggler-btn:hover {
    background-color: #2a2a2a;
}

/* Responsividade */
@media (max-width: 1024px) {
    .dashboard-content-wrapper {
        margin-left: 0;
    }
    
    .dashboard-content-wrapper.sidebar-collapsed {
        margin-left: 0;
    }
    
    .mobile-header-admin {
        display: flex;
    }
    
    .layout-content {
        padding-top: 50px;
    }
}

.hamburger-btn {
    display: none;
    position: fixed;
    top: 15px;
    left: 15px;
    background: #1f1f1f;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #e5e7eb;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    display: none; 
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.hamburger-btn svg {
    display: block;
}

.add-support-item-button-wrapper {
    margin-top: 20px;
    margin-bottom: 30px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

.add-support-item-btn {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1rem;
}

.add-support-item-btn:hover {
    background-color: #45a049;
}

.form-support-item {
    background-color: #1f1f1f;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 30px;
    margin-top: 20px;
    box-shadow: 0 4px 12px rgba(7, 51, 1, 0.4);
    max-height: 80vh;
    overflow-y: auto;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards; 
    padding-right: 15px;
}

.form-support-item::-webkit-scrollbar { width: 8px; }
.form-support-item::-webkit-scrollbar-track { background: #2a2a2a; border-radius: 10px; }
.form-support-item::-webkit-scrollbar-thumb { background-color: #555; border-radius: 10px; }
.form-support-item::-webkit-scrollbar-thumb:hover { background-color: #777; }

.form-support-item .header-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #333;
    padding-bottom: 15px;
    margin-bottom: 15px;
}

.form-support-item h1 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
}

.form-support-item .help-link {
    color: #00fa08;
    text-decoration: none;
    font-size: 0.9rem;
    margin-left: auto;
    margin-right: 20px;
}

.form-support-item .close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.6;
    padding: 0;
    line-height: 1;
}

.form-support-item > p {
    color: #aaa;
    margin-top: 0;
    margin-bottom: 25px;
}

.form-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.form-group {
    flex: 1 1 calc(50% - 10px);
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 0.9rem;
    color: #fff;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input,
.form-group textarea {
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
    width: 100%;
    font-family: 'Roboto', sans-serif;
}

.form-group textarea {
    min-height: 300px;
    resize: vertical;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #777;
}

.form-group .hint-text {
    font-size: 0.8rem;
    color: #a09f9f;
    margin-top: 5px;
}

.divisor {
    height: 1px;
    width: 100%;
    background-color: #333;
    margin: 20px 0;
    border: 1px solid #535353;
}

.footer-form {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.right-footer h3 {
    font-size: 0.9rem;
    color: #4CAF50;
    font-weight: 400;
    margin: 0;
}

.left-footer button {
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cancel-btn {
    background-color: transparent;
    border: 1px solid #777;
    color: #fff;
    margin-right: 10px;
}

.cancel-btn:hover {
    background-color: #333;
}

.save-btn {
    background-color: #4CAF50;
    border: none;
    color: #fff;
}

.save-btn:hover {
    background-color: #45a049;
}

.support-items-table {
    background-color: #1f1f1f;
    border-radius: 8px;
    padding: 0 20px 20px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    width: 100%;
    overflow-x: scroll; 
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: 0.5s;
}

.table-header,
.table-row-support-items {
    width: 100%; 
    text-align: left;
}

.table-content-wrapper {
    min-width: 800px; 
}

.table-header {
    display: grid;
    grid-template-columns: 2fr 3fr 1.5fr 1fr;
    align-items: center;
    padding: 10px 0;
    font-weight: 500;
    color: #aaa;
    font-size: 0.85rem;
    border-bottom: 1px solid #333;
    padding-top: 20px;
}

.table-body {
    padding-top: 10px;
}

.table-row-support-items {
    color: #fff;
    font-size: 0.9rem;
    border-bottom: 1px solid #2a2a2a; 
    display: grid; 
    grid-template-columns: 2fr 3fr 1.5fr 1fr;
    align-items: center;
    width: 100%;
    padding: 8px 0;
}

.table-row-support-items:last-child {
    border-bottom: none;
}

.td {
    padding: 0 10px; 
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
}

.td.subtitle-preview {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #aaa;
    font-size: 0.85rem;
}

.quill-editor-container {
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    min-height: 300px;
}

/* Estilos customizados para Quill no tema escuro */
.quill-editor-container .ql-toolbar {
    background-color: #1f1f1f;
    border-bottom: 1px solid #3a3a3a;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.quill-editor-container .ql-toolbar .ql-stroke {
    stroke: #fff;
}

.quill-editor-container .ql-toolbar .ql-fill {
    fill: #fff;
}

.quill-editor-container .ql-toolbar .ql-picker-label {
    color: #fff;
}

.quill-editor-container .ql-toolbar button:hover,
.quill-editor-container .ql-toolbar button.ql-active {
    background-color: #3a3a3a;
}

.quill-editor-container .ql-container {
    background-color: #2a2a2a;
    color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    font-family: 'Roboto', sans-serif;
    font-size: 0.95rem;
}

.quill-editor-container .ql-editor {
    min-height: 250px;
    color: #fff;
}

.quill-editor-container .ql-editor.ql-blank::before {
    color: #777;
    font-style: normal;
}

.quill-editor-container .ql-editor img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10px 0;
    border-radius: 4px;
}

.quill-editor-container .ql-snow .ql-picker {
    color: #fff;
}

.quill-editor-container .ql-snow .ql-picker-options {
    background-color: #1f1f1f;
    border: 1px solid #3a3a3a;
}

.quill-editor-container .ql-snow .ql-picker-item {
    color: #fff;
}

.quill-editor-container .ql-snow .ql-picker-item:hover {
    background-color: #3a3a3a;
}

.td.actions {
    display: flex;
    gap: 5px;
    justify-content: flex-end;
}

.action-btn {
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    padding: 5px;
    font-size: 1rem;
    transition: color 0.2s;
}

.action-btn:hover {
    color: #fff;
}

.action-btn.trash {
    color: #f44336;
}

.footer-view {
    margin-top: 20px;
}

@media (min-width: 769px) {
    .hamburger-btn {
        display: none;
    }
}

@media (max-width: 768px) {
    .hamburger-btn {
        display: block; 
    }
    
    .layout {
        width: 100%;
        margin-left: 0;
        padding: 10px;
        padding-top: 50px;
    }

    .left-footer {
        margin-top: 15px; 
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .left-footer button {
        flex: 1;
        max-width: 190px;
        width: 100%;
        text-align: center;
    }

    .cancel-btn {
        margin-right: 0;
        margin-bottom: 10px;
    }

    .form-container {
        flex-direction: column;
    }

    .form-support-item {
        padding: 15px;
        max-height: 70vh;
        margin-top: 20px;
    }

    .form-support-item h1 {
        font-size: 1.2rem;
    }

    .form-support-item .help-link {
        display: none; 
    }

    .support-items-table {
        overflow-x: auto;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>

