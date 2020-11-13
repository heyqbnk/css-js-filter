export class ColorsConverter {
  /**
   * Converts RGB to HSL.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @returns {[number, number, number]}
   */
  static rgbToHsl(
    r: number,
    g: number,
    b: number,
  ): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  /**
   * Converts hue to RGB component.
   * @param {number} p
   * @param {number} q
   * @param {number} t
   * @returns {number}
   */
  static hueToRgbComponent(
    p: number,
    q: number,
    t: number,
  ): number {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }

  /**
   * Converts HSL to RGB.
   * @param {number} h
   * @param {number} s
   * @param {number} l
   * @returns {Uint8ClampedArray}
   */
  static hslToRgb(
    h: number,
    s: number,
    l: number,
  ): [number, number, number] {
    let r, g, b;

    if (s == 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = this.hueToRgbComponent(p, q, h + 1 / 3);
      g = this.hueToRgbComponent(p, q, h);
      b = this.hueToRgbComponent(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
  }
}