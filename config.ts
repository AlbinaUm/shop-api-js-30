import path from 'path';

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  db: 'mongodb://localhost/shop-js-30',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  refreshSecret: process.env.REFRESH_SECRET || 'secret',
  clientID: process.env.CLIENT_ID || '...',
  clientSecret: process.env.CLIENT_SECRET || '...',
};

export default config;