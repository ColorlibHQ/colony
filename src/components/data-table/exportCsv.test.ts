import { describe, expect, it } from 'vitest';

import { toCsv, type CsvColumn } from './exportCsv';

interface Row {
  name: string;
  amount: number;
}

const cols: CsvColumn<Row>[] = [
  { key: 'name', header: 'Name', value: (r) => r.name },
  { key: 'amount', header: 'Amount', value: (r) => r.amount },
];

const body = (csv: string) => csv.replace(/^\uFEFF/, '').split('\r\n');

describe('toCsv', () => {
  it('writes a header row and one line per record', () => {
    const csv = body(toCsv([{ name: 'Ana', amount: 12 }], cols));
    expect(csv).toEqual(['Name,Amount', 'Ana,12']);
  });

  it('starts with a BOM so Excel reads UTF-8 rather than mojibake', () => {
    expect(
      toCsv([{ name: '张伟', amount: 1 }], cols).startsWith('\uFEFF'),
    ).toBe(true);
  });

  it('quotes and escapes values containing commas, quotes or newlines', () => {
    const csv = body(toCsv([{ name: 'Doe, "Jane"\nsecond', amount: 1 }], cols));
    expect(csv[1]).toBe('"Doe, ""Jane""\nsecond",1');
  });

  describe('formula injection', () => {
    /**
     * A cell beginning with = + - @ or a control char is executed as a formula
     * by Excel, Sheets and LibreOffice. Without neutralisation, whatever a user
     * typed into a text field becomes code on the reviewer's machine.
     */
    it.each([
      ['=1+1', "'=1+1"],
      ['+1+1', "'+1+1"],
      ['-1+1', "'-1+1"],
      ['@SUM(A1)', "'@SUM(A1)"],
      ['\tstart-tab', "'\tstart-tab"],
      ["=cmd|' /c calc'!A1", "'=cmd|' /c calc'!A1"],
    ])('neutralises %j', (input, expected) => {
      const csv = body(toCsv([{ name: input, amount: 0 }], cols));
      expect(csv[1]).toBe(`${expected},0`);
    });

    it('leaves ordinary values untouched', () => {
      const csv = body(toCsv([{ name: 'Marta Kovac', amount: 42 }], cols));
      expect(csv[1]).toBe('Marta Kovac,42');
    });
  });

  it('renders an empty body when there are no rows', () => {
    expect(body(toCsv([], cols))).toEqual(['Name,Amount']);
  });
});
