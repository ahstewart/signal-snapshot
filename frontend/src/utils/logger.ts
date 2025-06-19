// Only log in development mode or when explicitly enabled
const isDebug = process.env.NODE_ENV === 'development' || 
                process.env.REACT_APP_DEBUG === 'true';

export const debug = {
    log: (...args: any[]) => isDebug && console.log('[DEBUG]', ...args),
    info: (...args: any[]) => isDebug && console.info('[INFO]', ...args),
    warn: (...args: any[]) => isDebug && console.warn('[WARN]', ...args),
    error: (...args: any[]) => console.error('[ERROR]', ...args), // Always show errors
    time: (label: string) => isDebug && console.time(label),
    timeEnd: (label: string) => isDebug && console.timeEnd(label),
    group: (label: string) => isDebug && console.group(label),
    groupEnd: () => isDebug && console.groupEnd(),
    table: (data: any) => isDebug && console.table(data)
};

export default debug;
