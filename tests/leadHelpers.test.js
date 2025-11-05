
"use strict";

const {
  sanitizeEmail,
  mapAtuacaoValue,
  mapPossuiClinica,
  mapProdutosInteresse
} = require("../server/utils/leadHelpers");

describe("leadHelpers", () => {
  describe("sanitizeEmail", () => {
    it("normaliza email em minusculas sem espacos", () => {
      expect(sanitizeEmail("  Teste@Email.COM ")).toBe("teste@email.com");
    });

    it("retorna string vazia quando input e falsy", () => {
      expect(sanitizeEmail(null)).toBe("");
    });
  });

  describe("mapAtuacaoValue", () => {
    it("mapeia valores conhecidos para rotulos amigaveis", () => {
      expect(mapAtuacaoValue("anestesia_intensivismo")).toBe("Anestesia & Intensivismo");
    });

    it("mantem valor original quando mapeamento e desconhecido", () => {
      expect(mapAtuacaoValue("especialidade_x")).toBe("especialidade_x");
    });
  });

  describe("mapPossuiClinica", () => {
    it("mapeia respostas positivas para 'Sim'", () => {
      expect(mapPossuiClinica("SIM")).toBe("Sim");
    });

    it("mapeia respostas negativas para 'Nao'", () => {
      expect(mapPossuiClinica("nao")).toBe("Nao");
    });

    it("retorna 'Nao' quando valor esta vazio", () => {
      expect(mapPossuiClinica("")).toBe("Nao");
    });
  });

  describe("mapProdutosInteresse", () => {
    it("mapeia slug conhecido para o rotulo correspondente", () => {
      expect(
        mapProdutosInteresse(["monitores_diagnostico", "materiais_consumo"])
      ).toEqual([
        "Monitores & Diagnostico portátil",
        "Materiais de consumo"
      ]);
    });

    it("remove valores duplicados e preserva ordem", () => {
      expect(
        mapProdutosInteresse([
          "materiais_consumo",
          "MATERIAIS_CONSUMO",
          "aparelhos_anestesia"
        ])
      ).toEqual(["Materiais de consumo", "Aparelhos de anestesia"]);
    });

    it("ignora valores vazios", () => {
      expect(mapProdutosInteresse(["", null])).toEqual([]);
    });
  });
});
