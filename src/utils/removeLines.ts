export const removeLines = (data: string, lines = []) => data.split('\n').filter((val, idx) => lines.indexOf(idx as never) === -1).join('\n');
