
"use strict";

const {
  sanitizeEmail,
  mapAtuacaoValue,
  mapPossuiClinica
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
});
