const TextStyles = {
  fontFamily: {
    bold: 'roboto-bold',
    medium: 'roboto-medium',
    regular: 'roboto-regular',
  },
  fontSize: {
    XXXS: 8,
    XXS: 10,
    XS: 12,
    S: 14,
    M: 16,
    L: 18,
    XL: 20,
    XXL: 22,
    XXXL: 24,
  },
};

const getFontSizeFromSizeProp = fontSizeVal => TextStyles.fontSize[fontSizeVal];

export { TextStyles, getFontSizeFromSizeProp };
