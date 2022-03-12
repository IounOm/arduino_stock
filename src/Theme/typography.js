const typography = {
  useNextVariants: true,
  fontFamily: [
    'Nunito',
    'Prompt',
    'sans-serif',
    '-apple-system',
  ].join(','),
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  h1: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 60,
    lineHeight: 1.25,
    letterSpacing: '-1.5px',
    '@media (max-width:900px)': {
      fontSize: 55,
    },
    '@media (max-width:600px)': {
      fontSize: 50,
    },
  },
  h2: {
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: 48,
    lineHeight: 1.3,
    letterSpacing: '-0.5px',
    '@media (max-width:900px)': {
      fontSize: 43,
    },
    '@media (max-width:600px)': {
      fontSize: 38,
    },
  },
  h3: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 40,
    lineHeight: 1.4,
    '@media (max-width:900px)': {
      fontSize: 35,
    },
    '@media (max-width:600px)': {
      fontSize: 30,
    },
  },
  h4: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 32,
    lineHeight: 1.5,
    '@media (max-width:900px)': {
      fontSize: 28,
    },
    '@media (max-width:600px)': {
      fontSize: 22,
    },
  },
  h5: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 24,
    lineHeight: 1.3,
    letterSpacing: 0.18,
    textTransform: 'capitalize',
    '@media (max-width:900px)': {
      fontSize: 22,
    },
    '@media (max-width:600px)': {
      fontSize: 20,
    },
  },
  h6: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 20,
    lineHeight: 1.2,
    letterSpacing: 0.15,
    textTransform: 'capitalize',
    '@media (max-width:900px)': {
      fontSize: 18,
    },
    '@media (max-width:600px)': {
      fontSize: 16,
    },
  },
  subtitle1: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0.15,
    textTransform: 'capitalize',
    '@media (max-width:600px)': {
      fontSize: 14,
    },
  },
  subtitle2: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 1.5,
    letterSpacing: 0.1,
    '@media (max-width:600px)': {
      fontSize: 12,
    },
  },
  body1: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 1.5,
    '@media (max-width:600px)': {
      fontSize: 14,
    },
  },
  body2: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 1.57,
    letterSpacing: 0.1,
    '@media (max-width:600px)': {
      fontSize: 12,
    },
  },
  button: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 1.57,
    letterSpacing: 0.25,
    textTransform: 'uppercase',
    '@media (max-width:600px)': {
      fontSize: 12,
    },
  },
  caption: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 1.33,
    '@media (max-width:600px)': {
      fontSize: 10,
    },
  },
  overline: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 10,
    lineHeight: 1.5,
    '@media (max-width:600px)': {
      fontSize: 8,
    },
  },
}

export default typography
