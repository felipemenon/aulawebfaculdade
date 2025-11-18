// js/validation.js - Sistema de Validação de Formulário com Feedback ao Usuário

/**
 * Sistema de Validação de Formulário
 * Oferece validação avançada com feedback visual ao usuário
 */
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.fields = new Map();
    this.errors = new Map();
    this.validators = new Map();
    
    if (this.form) {
      this.init();
    }
  }

  /**
   * Inicializa o validador
   */
  init() {
    this.registerDefaultValidators();
    this.attachEventListeners();
  }

  /**
   * Registra validadores padrão
   */
  registerDefaultValidators() {
    // Validador de email
    this.registerValidator('email', (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return 'E-mail inválido. Verifique o formato.';
      }
      return null;
    });

    // Validador de CPF
    this.registerValidator('cpf', (value) => {
      if (!value) return null;
      
      const cpf = value.replace(/\D/g, '');
      
      if (cpf.length !== 11) {
        return 'CPF deve conter 11 dígitos.';
      }

      // Verificar se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cpf)) {
        return 'CPF inválido.';
      }

      // Validar primeiro dígito verificador
      let sum = 0;
      let remainder;
      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) {
        return 'CPF inválido.';
      }

      // Validar segundo dígito verificador
      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(10, 11))) {
        return 'CPF inválido.';
      }

      return null;
    });

    // Validador de telefone
    this.registerValidator('telefone', (value) => {
      if (!value) return null;
      
      const phone = value.replace(/\D/g, '');
      
      if (phone.length < 10 || phone.length > 11) {
        return 'Telefone deve conter 10 ou 11 dígitos.';
      }

      return null;
    });

    // Validador de CEP
    this.registerValidator('cep', (value) => {
      if (!value) return null;
      
      const cep = value.replace(/\D/g, '');
      
      if (cep.length !== 8) {
        return 'CEP deve conter 8 dígitos.';
      }

      return null;
    });

    // Validador de data de nascimento
    this.registerValidator('nasc', (value) => {
      if (!value) return null;
      
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        return 'Você deve ter pelo menos 18 anos.';
      }

      if (birthDate > today) {
        return 'Data de nascimento não pode ser no futuro.';
      }

      return null;
    });

    // Validador de comprimento mínimo
    this.registerValidator('minlength', (value, minLength) => {
      if (value && value.length < minLength) {
        return `Este campo deve conter no mínimo ${minLength} caracteres.`;
      }
      return null;
    });

    // Validador de campo obrigatório
    this.registerValidator('required', (value) => {
      if (!value || value.trim() === '') {
        return 'Este campo é obrigatório.';
      }
      return null;
    });

    // Validador de estado
    this.registerValidator('estado', (value) => {
      if (!value || value === '') {
        return 'Por favor, selecione um estado.';
      }
      return null;
    });
  }

  /**
   * Registra um validador customizado
   * @param {string} name - Nome do validador
   * @param {Function} fn - Função validadora
   */
  registerValidator(name, fn) {
    this.validators.set(name, fn);
  }

  /**
   * Anexa listeners aos campos do formulário
   */
  attachEventListeners() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Validar ao sair do campo (blur)
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      // Limpar erro ao começar a digitar
      input.addEventListener('input', () => {
        if (this.errors.has(input.id)) {
          this.clearFieldError(input.id);
        }
      });

      // Armazenar referência do campo
      this.fields.set(input.id, input);
    });

    // Validar ao submeter o formulário
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (this.validateForm()) {
        this.handleValidFormSubmit();
      }
    });
  }

  /**
   * Valida um campo específico
   * @param {HTMLElement} field - Campo a validar
   * @returns {boolean} Se o campo é válido
   */
  validateField(field) {
    const fieldId = field.id;
    const value = field.value;
    let error = null;

    // Validar campo obrigatório
    if (field.hasAttribute('required')) {
      const requiredError = this.validators.get('required')(value);
      if (requiredError) {
        error = requiredError;
      }
    }

    // Se não há erro de obrigatoriedade e o campo tem valor, validar tipo
    if (!error && value) {
      const fieldType = field.type || field.tagName.toLowerCase();
      
      if (fieldType === 'email') {
        error = this.validators.get('email')(value);
      } else if (fieldId === 'cpf') {
        error = this.validators.get('cpf')(value);
      } else if (fieldId === 'telefone') {
        error = this.validators.get('telefone')(value);
      } else if (fieldId === 'cep') {
        error = this.validators.get('cep')(value);
      } else if (fieldId === 'nasc') {
        error = this.validators.get('nasc')(value);
      } else if (fieldId === 'estado') {
        error = this.validators.get('estado')(value);
      }

      // Validar minlength
      if (!error && field.hasAttribute('minlength')) {
        const minLength = parseInt(field.getAttribute('minlength'));
        error = this.validators.get('minlength')(value, minLength);
      }
    }

    // Exibir ou limpar erro
    if (error) {
      this.showFieldError(fieldId, error);
      return false;
    } else {
      this.clearFieldError(fieldId);
      return true;
    }
  }

  /**
   * Valida todo o formulário
   * @returns {boolean} Se o formulário é válido
   */
  validateForm() {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Exibe erro em um campo
   * @param {string} fieldId - ID do campo
   * @param {string} message - Mensagem de erro
   */
  showFieldError(fieldId, message) {
    const field = this.fields.get(fieldId);
    if (!field) return;

    this.errors.set(fieldId, message);

    // Adicionar classe de erro
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');

    // Remover mensagem anterior se existir
    const existingError = field.parentElement.querySelector('.form-field__error');
    if (existingError) {
      existingError.remove();
    }

    // Criar e inserir elemento de erro
    const errorElement = document.createElement('span');
    errorElement.className = 'form-field__error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    field.parentElement.appendChild(errorElement);

    // Adicionar classe ao container do campo
    field.parentElement.classList.add('form-field--error');
  }

  /**
   * Limpa erro de um campo
   * @param {string} fieldId - ID do campo
   */
  clearFieldError(fieldId) {
    const field = this.fields.get(fieldId);
    if (!field) return;

    this.errors.delete(fieldId);

    // Remover classe de erro
    field.classList.remove('is-invalid');
    field.setAttribute('aria-invalid', 'false');

    // Remover elemento de erro
    const errorElement = field.parentElement.querySelector('.form-field__error');
    if (errorElement) {
      errorElement.remove();
    }

    // Remover classe do container
    field.parentElement.classList.remove('form-field--error');
  }

  /**
   * Handler para envio de formulário válido
   */
  handleValidFormSubmit() {
    // Coletar dados do formulário
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Salvar no localStorage
    this.saveFormData(data);

    // Exibir mensagem de sucesso
    this.showSuccessMessage();

    // Limpar formulário
    this.form.reset();

    // Limpar erros
    this.errors.clear();
  }

  /**
   * Salva dados do formulário no localStorage
   * @param {Object} data - Dados do formulário
   */
  saveFormData(data) {
    const formName = this.form.id || 'form-data';
    const timestamp = new Date().toISOString();
    
    // Recuperar dados anteriores
    const storageKey = `${formName}-submissions`;
    let submissions = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Adicionar novo envio
    submissions.push({
      ...data,
      timestamp: timestamp
    });

    // Limitar a 10 últimos envios
    if (submissions.length > 10) {
      submissions = submissions.slice(-10);
    }

    // Salvar no localStorage
    localStorage.setItem(storageKey, JSON.stringify(submissions));

    // Também salvar os dados atuais para preenchimento automático
    localStorage.setItem(`${formName}-current`, JSON.stringify(data));
  }

  /**
   * Exibe mensagem de sucesso
   */
  showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.setAttribute('role', 'alert');
    successDiv.innerHTML = `
      <strong>Sucesso!</strong> Formulário enviado com sucesso. Os dados foram salvos localmente.
    `;

    // Inserir antes do formulário
    this.form.parentElement.insertBefore(successDiv, this.form);

    // Remover mensagem após 5 segundos
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  /**
   * Carrega dados salvos do formulário
   */
  loadFormData() {
    const formName = this.form.id || 'form-data';
    const storageKey = `${formName}-current`;
    const savedData = JSON.parse(localStorage.getItem(storageKey));

    if (savedData) {
      Object.keys(savedData).forEach(key => {
        const field = this.fields.get(key);
        if (field) {
          field.value = savedData[key];
        }
      });
    }
  }

  /**
   * Obtém histórico de envios
   * @returns {Array} Array com histórico de envios
   */
  getSubmissionHistory() {
    const formName = this.form.id || 'form-data';
    const storageKey = `${formName}-submissions`;
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  }

  /**
   * Limpa histórico de envios
   */
  clearSubmissionHistory() {
    const formName = this.form.id || 'form-data';
    const storageKey = `${formName}-submissions`;
    localStorage.removeItem(storageKey);
  }
}

// Inicializar validador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');
  if (form) {
    window.formValidator = new FormValidator('#cadastroForm');
    
    // Tentar carregar dados salvos
    window.formValidator.loadFormData();
  }
});
