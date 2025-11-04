"use strict";

const { getSaoPauloTimestamp } = require("../server/utils/timezone");

describe("timezone utils", () => {
  it("converte data UTC para horario de Sao Paulo", () => {
    const sampleDate = new Date(Date.UTC(2024, 6, 1, 12, 0, 0)); // 2024-07-01T12:00:00Z
    const formatted = getSaoPauloTimestamp(sampleDate);
    expect(formatted).toBe("2024-07-01T09:00:00-03:00");
  });

  it("usa offset -03:00 para horario atual", () => {
    const formatted = getSaoPauloTimestamp();
    expect(formatted.endsWith("-03:00")).toBe(true);
  });
});
