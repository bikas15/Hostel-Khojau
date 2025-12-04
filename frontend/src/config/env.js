// Environment configuration for Vite
// Since Vite handles environment variables differently than Create React App

// Get environment variables (Vite automatically loads VITE_ prefixed variables)
const getEnvVar = (key, defaultValue = '') => {
  // Try to get from import.meta.env (Vite way)
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  
  // Fallback to default value
  return defaultValue;
};

export const ENV = {
  TAWK_PROPERTY_ID: getEnvVar('VITE_TAWK_PROPERTY_ID', '6880eb66debf5719175844b4'),
  TAWK_WIDGET_ID: getEnvVar('VITE_TAWK_WIDGET_ID', '68adc6e07c7746bfaecece9e22cb6c3bf4f994b0'),
};