/**
 * Design System - Cores Cumes Brasil
 * 
 * Cores sincronizadas com src/css/app.scss
 * Use estas constantes quando precisar acessar cores no TypeScript/JavaScript
 */

export const CUMES_COLORS = {
  // Cores principais
  cumes01: '#8CB369',  // Verde Aventura (Principal)
  cumes02: '#546119',  // Verde Escuro
  cumes03: '#F29340',  // Laranja Montanhismo
  cumes04: '#F4E285',  // Amarelo Suave
  cumes05: '#BC4B51',  // Vermelho/Bordô
  offwhite: '#ffffe4', // Off-white
  
  // Cores customizadas
  yellow: '#fffd5e',
  green: '#BCE9B4',
  red: '#ff5858',
  blue: '#7E9CE8',
  purple: '#ca74ef',
  pink: '#EF9D9D',
  orange: '#fcbd7b',
  brown: '#e4a16a',
  grey: '#757575',
  
  // Background
  background: '#2c2c2c',
  light: '#f5f5f5'
} as const;

/**
 * Aliases para facilitar o uso
 */
export const COLORS = {
  primary: CUMES_COLORS.cumes01,
  primaryDark: CUMES_COLORS.cumes02,
  secondary: CUMES_COLORS.cumes03,
  accent: CUMES_COLORS.cumes04,
  danger: CUMES_COLORS.cumes05
} as const;

