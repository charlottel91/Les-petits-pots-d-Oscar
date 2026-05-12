const { config } = require('dotenv');

const APP_ENV = process.env.APP_ENV ?? 'development';
const envFile = APP_ENV === 'production' ? '.env.prod' : '.env';

// Charge le fichier env approprié en écrasant les variables déjà définies
config({ path: envFile, override: true });

/** @type {(ctx: import('expo/config').ConfigContext) => import('expo/config').ExpoConfig} */
module.exports = ({ config: existingConfig }) => ({
  ...existingConfig,
  extra: {
    ...existingConfig.extra,
    appEnv: APP_ENV,
  },
});
