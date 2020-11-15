import {ColorsConverter} from './ColorsConverter';

/**
 * Библиотека которая может работать с цветами.
 */
export class ColorsFilter {
  /**
   * Cuts number and makes it stay in [0, 255].
   * @param {number} value
   * @returns {number}
   */
  static adjustComponent(value: number): number {
    return Math.min(Math.max(0, Math.ceil(value)), 255);
  }

  /**
   * Grayscales pixel component.
   * @param {number} component
   * @param {number} targetValue
   * @param {number} amount
   * @returns {number}
   * @private
   */
  private static grayscaleComponent(
    component: number,
    targetValue: number,
    amount: number,
  ) {
    const diff = (targetValue - component) * amount;

    return this.adjustComponent(component + diff);
  }

  /**
   * Grayscales pixel.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} amount
   * @returns {[number, number, number]}
   */
  static grayscale(
    r: number,
    g: number,
    b: number,
    amount: number,
  ): [number, number, number] {
    const targetValue = r * 0.299 + g * 0.587 + b * 0.114;

    return [
      this.grayscaleComponent(r, targetValue, amount),
      this.grayscaleComponent(g, targetValue, amount),
      this.grayscaleComponent(b, targetValue, amount),
    ];
  }

  /**
   * Rotates hue. Works as it should.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param amount
   * @returns {[number, number, number]}
   */
  static hueRotation(
    r: number,
    g: number,
    b: number,
    amount: number,
  ): [number, number, number] {
    const [h, s, l] = ColorsConverter.rgbToHsl(r, g, b);

    return ColorsConverter.hslToRgb(h + amount, s, l);
  }

  /**
   * Rotates hue. Works the same as browsers do.
   * @see https://stackoverflow.com/questions/19187905/why-doesnt-hue-rotation-by-180deg-and-180deg-yield-the-original-color/19325417#19325417
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param amount
   * @returns {[number, number, number]}
   */
  static hueRotationBrowser(
    r: number,
    g: number,
    b: number,
    amount: number,
  ): [number, number, number] {
    const matrix = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
    // Format angle.
    const angle = amount * 360;

    // Coefficients for luminosity.
    const lumR = 0.2126;
    const lumG = 0.7152;
    const lumB = 0.0722;

    // Coefficients for hue rotation.
    const hueRotateR = 0.143;
    const hueRotateG = 0.140;
    const hueRotateB = 0.283;

    const cos = Math.cos(angle * Math.PI / 180);
    const sin = Math.sin(angle * Math.PI / 180);

    matrix[0] = lumR + (1 - lumR) * cos - lumR * sin;
    matrix[1] = lumG - lumG * cos - lumG * sin;
    matrix[2] = lumB - lumB * cos + (1 - lumB) * sin;

    matrix[3] = lumR - lumR * cos + hueRotateR * sin;
    matrix[4] = lumG + (1 - lumG) * cos + hueRotateG * sin;
    matrix[5] = lumB - lumB * cos - hueRotateB * sin;

    matrix[6] = lumR - lumR * cos - (1 - lumR) * sin;
    matrix[7] = lumG - lumG * cos + lumG * sin;
    matrix[8] = lumB + (1 - lumB) * cos + lumB * sin;

    return [
      this.adjustComponent(matrix[0] * r + matrix[1] * g + matrix[2] * b),
      this.adjustComponent(matrix[3] * r + matrix[4] * g + matrix[5] * b),
      this.adjustComponent(matrix[6] * r + matrix[7] * g + matrix[8] * b),
    ];
  }

  /**
   * Changes pixel saturation.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param multiplier
   * @returns {[number, number, number]}
   */
  static saturate(
    r: number,
    g: number,
    b: number,
    multiplier: number,
  ): [number, number, number] {
    const [h, s, l] = ColorsConverter.rgbToHsl(r, g, b);

    return ColorsConverter.hslToRgb(h, s * multiplier, l);
  }

  /**
   * Applies sepia to pixel component.
   * @param {number} component
   * @param {number} targetComponent
   * @param {number} multiplier
   * @returns {number}
   * @private
   */
  private static sepiaComponent(
    component: number,
    targetComponent: number,
    multiplier: number,
  ): number {
    const diff = (targetComponent - component) * multiplier;

    return this.adjustComponent(component + diff);
  }

  /**
   * Applies sepia to pixel.
   * @see https://dyclassroom.com/image-processing-project/how-to-convert-a-color-image-into-sepia-image
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} multiplier
   * @returns {[number, number, number]}
   */
  static sepia(
    r: number,
    g: number,
    b: number,
    multiplier: number,
  ): [number, number, number] {
    const tr = 0.393 * r + 0.769 * g + 0.189 * b;
    const tg = 0.349 * r + 0.686 * g + 0.168 * b;
    const tb = 0.272 * r + 0.534 * g + 0.131 * b;

    return [
      this.sepiaComponent(r, tr, multiplier),
      this.sepiaComponent(g, tg, multiplier),
      this.sepiaComponent(b, tb, multiplier),
    ];
  }

  /**
   * Changes pixel component contrast.
   * @param {number} component
   * @param multiplier
   * @returns {number}
   * @private
   */
  private static contrastComponent(
    component: number,
    multiplier: number,
  ): number {
    return multiplier * (component - 128) + 128;
  }

  /**
   * Changes pixel contrast.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param multiplier
   * @returns {[number, number, number]}
   */
  static contrast(
    r: number,
    g: number,
    b: number,
    multiplier: number,
  ): [number, number, number] {
    return [
      this.contrastComponent(r, multiplier),
      this.contrastComponent(g, multiplier),
      this.contrastComponent(b, multiplier),
    ];
  }

  /**
   * Changes pixel component brightness.
   * @param {number} component
   * @param multiplier
   * @returns {number}
   * @private
   */
  private static brightenComponent(
    component: number,
    multiplier: number,
  ): number {
    return this.adjustComponent(component * multiplier);
  }

  /**
   * Changes pixel brightness.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param multiplier
   * @returns {[number, number, number]}
   */
  static brighten(
    r: number,
    g: number,
    b: number,
    multiplier: number,
  ): [number, number, number] {
    return [
      this.brightenComponent(r, multiplier),
      this.brightenComponent(g, multiplier),
      this.brightenComponent(b, multiplier),
    ];
  }

  /**
   * Opacifies pixel component.
   * @param {number} a
   * @param {number} multiplier
   * @returns {number}
   */
  static opacify(a: number, multiplier: number): number {
    return this.adjustComponent(a * multiplier);
  }

  /**
   * Inverts pixel component.
   * @param {number} component
   * @param {number} multiplier
   * @returns {number}
   * @private
   */
  private static invertComponent(
    component: number,
    multiplier: number
  ): number {
    const targetValue = 255 - component;
    const diff = targetValue - component;

    return this.adjustComponent(component + diff * multiplier);
  }

  /**
   * Inverts pixel.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} multiplier
   * @returns {[number, number, number]}
   */
  static invert(
    r: number,
    g: number,
    b: number,
    multiplier: number,
  ): [number, number, number] {
    return [
      this.invertComponent(r, multiplier),
      this.invertComponent(g, multiplier),
      this.invertComponent(b, multiplier),
    ];
  }
}