import path from 'path';

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  db: 'mongodb://localhost/shop-js-30',
  jwtSecret: process.env.JWT_SECRET || 'secret',
};

export default config;