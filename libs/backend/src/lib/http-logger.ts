import morgan from 'morgan';

/**
 * Http logger middleware
 */
export const httpLogger = () => morgan('tiny');
