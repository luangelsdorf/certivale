export function phoneMask(phone) {
  if (phone.length <= 14) {
    // landline phone
    return phone.replace(/\D/g, '')
      .replace(/^(\d)/, '($1')
      .replace(/^(\(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{4})(\d{1,5})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    // cell phone
    return phone.replace(/\D/g, '')
      .replace(/^(\d)/, '($1')
      .replace(/^(\(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{5})(\d{1,5})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
}

export function maskCNPJ(CNPJ) {
  return CNPJ
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export function maskCPF(CPF) {
  return CPF
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export function maskDate(date) {
  return date
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1");
};

export function maskCEP(CEP) {
  return CEP
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d{3})/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

export function maskMoney(value) {
  value = value.replace('.', '').replace(',', '').replace(/\D/g, '')

  const formatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 });
  const result = formatter.format(parseFloat(value) / 100);
  
  return 'R$ ' + result;
}