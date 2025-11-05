"use strict";

function sanitizeEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

function mapAtuacaoValue(value = "") {
  const normalized = String(value || "").toLowerCase();
  const mapping = {
    anestesia_intensivismo: "Anestesia & Intensivismo",
    cirurgia: "Cirurgia Geral & Especializada",
    imagem_monitoramento: "Diagnostico por Imagem & Monitoramento",
    clinica_geral: "Clinica Medica / Atendimento Geral",
    especialidades_internas: "Especialidades Internas (Cardio, Onco, Dermato etc.)",
    odontologia_oftalmologia: "Odontologia & Oftalmologia",
    reabilitacao_fisioterapia: "Reabilitacao & Fisioterapia",
    animais_exoticos: "Animais Nao Convencionais / Exoticos",
    gestao_compras: "Gestao / Compras / Engenharia Clinica",
    academico: "Academico (Estudante / Residente / Docente)"
  };
  return mapping[normalized] || value || "";
}

function mapPossuiClinica(value = "") {
  const normalized = String(value || "").toLowerCase();
  if (["sim", "s", "yes", "y"].includes(normalized)) return "Sim";
  if (["nao", "n", "no"].includes(normalized)) return "Nao";
  return value || "Nao";
}

function mapProdutosInteresse(values = []) {
  if (!Array.isArray(values)) {
    return [];
  }

  const mapping = {
    monitores_diagnostico: "Monitores & Diagnostico portátil",
    materiais_consumo: "Materiais de consumo",
    aparelhos_anestesia: "Aparelhos de anestesia",
    materiais_cirurgicos: "Materiais cirúrgicos",
    produtos_animais_exoticos: "Produtos para animais exóticos",
    pecas_reposicao_manutencao: "Peças de reposição & manutenção"
  };

  const seen = new Set();
  const labels = [];

  values.forEach((value) => {
    const key = String(value || "").toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    const label = mapping[key] || value || "";
    if (label) {
      labels.push(label);
    }
  });

  return labels;
}

module.exports = {
  sanitizeEmail,
  mapAtuacaoValue,
  mapPossuiClinica,
  mapProdutosInteresse
};
