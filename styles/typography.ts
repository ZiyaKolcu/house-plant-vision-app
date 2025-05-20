import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    textAlign: 'center',
  },
  bodySmall: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  link: {
    fontSize: 16,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
