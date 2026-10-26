// Only the web export gets a base path (set by the deploy workflow), so
// Expo Go and `npx expo start` keep serving from the root as before.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.EXPO_WEB_BASE_URL ? { baseUrl: process.env.EXPO_WEB_BASE_URL } : {}),
  },
});
