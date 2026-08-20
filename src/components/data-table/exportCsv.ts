/**
 * CSV export.
 *
 * Values are escaped for CSV *and* neutralised against formula injection: a
 * cell beginning with = + - @ or a control character is executed as a formula
 * when the file is opened in Excel, Sheets or LibreOffice, which turns an
 * innocent "export to CSV" button into a delivery mechanism for whatever a user
 * typed into a text field. Prefixing with a single quote keeps the value
 * readable while forcing the spreadsheet to treat it as text.
 *
 * OWASP: https://owasp.org/www-community/attacks/CSV_Injection
 */
const RISKY_PREFIX = /^[=+\-@\t\r]/;

/** Byte order mark. Written as an escape — a literal BOM in source is invisible
 *  and trips `no-irregular-whitespace`. */
const BOM = '\uFEFF';

/**
 * What a cell may hold. Deliberately narrow: allowing `unknown` here let an
 * object reach `String()` and land in the file as "[object Object]" with no
 * warning at the call site.
 */
export type CsvValue = string | number | boolean | Date | null | undefined;

function escapeCell(value: CsvValue): string {
  if (value == null) return '';
  let s =
    value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
  if (RISKY_PREFIX.test(s)) s = `'${s}`;
  if (/["\n,;]/.test(s)) s = `"${s.replaceAll('"', '""')}"`;
  return s;
}

export interface CsvColumn<T> {
  key: string;
  header: string;
  value: (row: T) => CsvValue;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const head = columns.map((c) => escapeCell(c.header)).join(',');
  const body = rows.map((r) =>
    columns.map((c) => escapeCell(c.value(r))).join(','),
  );
  // BOM so Excel opens UTF-8 correctly — without it, Chinese columns are mojibake.
  return `${BOM}${[head, ...body].join('\r\n')}`;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
