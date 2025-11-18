// js/spa.js - Sistema básico de Single Page Application (SPA)

/**
 * Sistema de Single Page Application (SPA) básico
 * Permite navegar entre páginas sem recarregar a página inteira
 */
class SimpleSPA {
  constructor() {
    this.pages = new Map();
    this.currentPage = null;
    this.container = document.getElementById('app-container');
    
    // Se não existir container, usar o main como container
    if (!this.container) {
      this.container = document.querySelector('main');
    }
    
    this.init();
  }

  /**
   * Inicializa o sistema SPA
   */
  init() {
    // Interceptar cliques em links internos
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Apenas interceptar links internos (que não começam com http)
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        e.preventDefault();
        this.navigate(href);
      }
    });

    // Suportar botão voltar do navegador
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.loadPage(e.state.page, false);
      }
    });
  }

  /**
   * Registra uma página no sistema SPA
   * @param {string} path - Caminho da página (ex: 'index.html')
   * @param {string} content - Conteúdo HTML da página
   */
  registerPage(path, content) {
    this.pages.set(path, content);
  }

  /**
   * Navega para uma página
   * @param {string} path - Caminho da página
   */
  navigate(path) {
    this.loadPage(path, true);
  }

  /**
   * Carrega uma página
   * @param {string} path - Caminho da página
   * @param {boolean} pushState - Se deve adicionar ao histórico
   */
  loadPage(path, pushState = true) {
    if (this.pages.has(path)) {
      const content = this.pages.get(path);
      this.currentPage = path;
      
      if (this.container) {
        this.container.innerHTML = content;
      }
      
      // Atualizar histórico
      if (pushState) {
        window.history.pushState({ page: path }, '', path);
      }
      
      // Disparar evento customizado
      window.dispatchEvent(new CustomEvent('pageLoaded', { detail: { page: path } }));
      
      // Re-inicializar scripts que precisam rodar em cada página
      this.reinitializeScripts();
    }
  }

  /**
   * Reinicializa scripts após carregar uma página
   */
  reinitializeScripts() {
    // Re-inicializar menu hamburger
    const toggles = document.querySelectorAll('.hamburger');
    toggles.forEach(btn => {
      btn.removeEventListener('click', this.handleHamburgerClick);
      btn.addEventListener('click', this.handleHamburgerClick);
    });
  }

  /**
   * Handler para clique no hamburger
   */
  static handleHamburgerClick = function() {
    const nav = document.querySelector('.nav__menu');
    if (nav) {
      nav.classList.toggle('open');
    }
  }
}

// Inicializar SPA quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Criar instância global do SPA
  window.spa = new SimpleSPA();
});
