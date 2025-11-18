// js/templates.js - Sistema de Templates JavaScript

/**
 * Sistema de Templates JavaScript
 * Permite reutilizar componentes HTML de forma dinâmica
 */
class TemplateEngine {
  constructor() {
    this.templates = new Map();
    this.components = new Map();
  }

  /**
   * Registra um template
   * @param {string} name - Nome do template
   * @param {string} html - HTML do template
   */
  registerTemplate(name, html) {
    this.templates.set(name, html);
  }

  /**
   * Registra um componente reutilizável
   * @param {string} name - Nome do componente
   * @param {Function} renderFn - Função que renderiza o componente
   */
  registerComponent(name, renderFn) {
    this.components.set(name, renderFn);
  }

  /**
   * Renderiza um template com dados
   * @param {string} name - Nome do template
   * @param {Object} data - Dados para interpolar no template
   * @returns {string} HTML renderizado
   */
  render(name, data = {}) {
    if (!this.templates.has(name)) {
      console.warn(`Template "${name}" não encontrado`);
      return '';
    }

    let html = this.templates.get(name);

    // Substituir variáveis no formato {{variavel}}
    html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });

    return html;
  }

  /**
   * Renderiza um componente
   * @param {string} name - Nome do componente
   * @param {Object} props - Props do componente
   * @returns {string} HTML do componente
   */
  renderComponent(name, props = {}) {
    if (!this.components.has(name)) {
      console.warn(`Componente "${name}" não encontrado`);
      return '';
    }

    const renderFn = this.components.get(name);
    return renderFn(props);
  }

  /**
   * Renderiza um template e insere no DOM
   * @param {string} name - Nome do template
   * @param {HTMLElement} element - Elemento onde inserir
   * @param {Object} data - Dados para o template
   */
  renderTo(name, element, data = {}) {
    const html = this.render(name, data);
    if (element) {
      element.innerHTML = html;
    }
  }
}

// Instância global do motor de templates
window.templateEngine = new TemplateEngine();

/**
 * Registra templates padrão do projeto
 */
function registerDefaultTemplates() {
  // Template para mensagem de erro
  window.templateEngine.registerTemplate('error-message', `
    <div class="alert alert-danger" role="alert">
      <strong>Erro!</strong> {{message}}
    </div>
  `);

  // Template para mensagem de sucesso
  window.templateEngine.registerTemplate('success-message', `
    <div class="alert alert-success" role="alert">
      <strong>Sucesso!</strong> {{message}}
    </div>
  `);

  // Template para mensagem de aviso
  window.templateEngine.registerTemplate('warning-message', `
    <div class="alert alert-warning" role="alert">
      <strong>Atenção!</strong> {{message}}
    </div>
  `);

  // Template para campo de formulário com erro
  window.templateEngine.registerTemplate('form-field-error', `
    <div class="form-field form-field--error">
      <label for="{{fieldId}}">{{label}}</label>
      <input id="{{fieldId}}" name="{{fieldName}}" type="{{type}}" {{attributes}}>
      <span class="form-field__error">{{error}}</span>
    </div>
  `);

  // Componente para card de projeto
  window.templateEngine.registerComponent('project-card', (props) => {
    return `
      <article class="card">
        <img src="${props.image || 'imagens/default.jpg'}" alt="${props.title || 'Projeto'}">
        <div class="card-body">
          <h3>${props.title || 'Sem título'}</h3>
          <p>${props.description || 'Sem descrição'}</p>
          <div class="mt-2">
            <a href="${props.link || '#'}" class="btn btn-primary">Saiba mais</a>
          </div>
        </div>
      </article>
    `;
  });

  // Componente para campo de formulário
  window.templateEngine.registerComponent('form-field', (props) => {
    const inputType = props.type || 'text';
    const required = props.required ? 'required' : '';
    const errorClass = props.error ? 'form-field--error' : '';
    
    let fieldHtml = `
      <div class="form-field ${errorClass}">
        <label for="${props.id}">${props.label || ''}${props.required ? ' *' : ''}</label>
    `;

    if (inputType === 'select') {
      fieldHtml += `<select id="${props.id}" name="${props.name}" ${required}>`;
      if (props.options) {
        props.options.forEach(opt => {
          fieldHtml += `<option value="${opt.value}">${opt.label}</option>`;
        });
      }
      fieldHtml += `</select>`;
    } else if (inputType === 'textarea') {
      fieldHtml += `<textarea id="${props.id}" name="${props.name}" ${required}></textarea>`;
    } else {
      fieldHtml += `<input id="${props.id}" name="${props.name}" type="${inputType}" ${required}>`;
    }

    if (props.error) {
      fieldHtml += `<span class="form-field__error">${props.error}</span>`;
    }

    fieldHtml += `</div>`;
    return fieldHtml;
  });
}

// Registrar templates padrão quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', registerDefaultTemplates);
