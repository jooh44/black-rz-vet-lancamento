"use strict";

const saoPauloFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZoneName: "longOffset"
});

function getSaoPauloTimestamp(date = new Date()) {
  const parts = saoPauloFormatter.formatToParts(date);
  const values = {};

  for (const part of parts) {
    values[part.type] = part.value;
  }

  const offset = (values.timeZoneName || "GMT-03:00").replace("GMT", "");
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}${offset}`;
}

module.exports = {
  getSaoPauloTimestamp
};
