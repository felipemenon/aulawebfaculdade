// js/masks.js
document.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.matches('#cpf, #telefone, #cep')) return;

  const id = el.id;
  let v = el.value.replace(/\D/g, '');

  if (id === 'cpf') {
    if (v.length > 11) v = v.slice(0,11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
         .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    el.value = v;
  }

  if (id === 'telefone') {
    if (v.length > 11) v = v.slice(0,11);
    if (v.length <= 10) {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    el.value = v;
  }

  if (id === 'cep') {
    if (v.length > 8) v = v.slice(0,8);
    v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    el.value = v;
  }
});
