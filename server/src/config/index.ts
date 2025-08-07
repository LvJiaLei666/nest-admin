import configDev from './config.dev';
import configProd from './config.prod';

/**
 * 导出配置文件
 */
export default () => {
  let config = null;
  if (isDev()) {
    config = configDev;
  } else {
    config = configProd;
  }
  return config;
};

/**
 * 判断是不是开发环境
 * @returns
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}
