import { isCssColorLiteral, parseCssColor } from '../../to/colorsUtils';

describe('isCssColorLiteral()', () => {
  it('recognizes named colors (case‐insensitive, trimmed)', () => {
    expect(isCssColorLiteral('red')).toBe(true);
    expect(isCssColorLiteral('  ReBeCcaPuRpLe  ')).toBe(true);
    expect(isCssColorLiteral('transparent')).toBe(true);
  });

  it('recognizes valid hex literals', () => {
    [
      '#abc',
      '#abcd',
      '#aabbcc',
      '#aabbccdd',
      '#ABC',
      '#ABCD',
      '#AABBCC',
      '#AABBCCDD',
    ].forEach((h) => {
      expect(isCssColorLiteral(h)).toBe(true);
    });
  });

  it('recognizes rgb / rgba formats', () => {
    expect(isCssColorLiteral('rgb(10,20,30)')).toBe(true);
    expect(isCssColorLiteral('rgba(10, 20, 30, 0.5)')).toBe(true);
    expect(isCssColorLiteral('RGB( 100 , 150 , 200 )')).toBe(true);
  });

  it('recognizes hsl / hsla formats', () => {
    expect(isCssColorLiteral('hsl(120,50%,75%)')).toBe(true);
    expect(isCssColorLiteral('hsla(240, 100%, 50%, 1)')).toBe(true);
    expect(isCssColorLiteral('HSL(0,0%,0%)')).toBe(true);
  });

  it('rejects invalid color strings', () => {
    [
      'notacolor',
      '#12',
      '#12345',
      'rgb(300,0,0)',
      'hsl(0,100,50%)',
      '',
    ].forEach((s) => {
      expect(isCssColorLiteral(s)).toBe(false);
    });
  });
});

describe('parseCssColor()', () => {
  it('parses named colors via lookup', () => {
    expect(parseCssColor('white')).toEqual([255, 255, 255, 1]);
    expect(parseCssColor(' AliceBlue ')).toEqual([240, 248, 255, 1]);
  });

  it('parses 3- and 4-digit hex', () => {
    expect(parseCssColor('#abc')).toEqual([0xaa, 0xbb, 0xcc, 1]);
    expect(parseCssColor('#abcd')).toEqual([0xaa, 0xbb, 0xcc, 0xdd / 255]);
  });

  it('parses 6- and 8-digit hex', () => {
    expect(parseCssColor('#112233')).toEqual([0x11, 0x22, 0x33, 1]);
    expect(parseCssColor('#11223344')).toEqual([0x11, 0x22, 0x33, 0x44 / 255]);
  });

  it('parses rgb() with integer and float components', () => {
    expect(parseCssColor('rgb(0,128,255)')).toEqual([0, 128, 255, 1]);
    expect(parseCssColor('rgb( 10.5 , 20.25 , 30 )')).toEqual([
      10.5, 20.25, 30, 1,
    ]);
  });

  it('parses rgba() including alpha', () => {
    expect(parseCssColor('rgba(0, 0, 0, 0)')).toEqual([0, 0, 0, 0]);
    expect(parseCssColor('rgba(255,255,255,1)')).toEqual([255, 255, 255, 1]);
  });

  it('parses hsl() and converts to rgb', () => {
    expect(parseCssColor('hsl(0,100%,50%)')).toEqual([255, 0, 0, 1]);
    expect(parseCssColor(' hsl(120,100%,25%) ')).toEqual([0, 128, 0, 1]);
  });

  it('parses hsla() with alpha', () => {
    const [r, g, b, a] = parseCssColor('hsla(240,50%,50%,0.25)');
    expect([r, g, b]).toEqual([64, 64, 191]);
    expect(a).toBeCloseTo(0.25);
  });

  it('throws on unrecognized strings', () => {
    ['#12', 'rgb()', 'hsl(0,0%,0%,0)', 'foobar'].forEach((s) => {
      expect(() => parseCssColor(s)).toThrow(/Unrecognized CSS color/);
    });
  });
});
