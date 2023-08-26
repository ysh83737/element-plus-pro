import { relative, resolve } from 'node:path';
import { DOCS_ROOT, DOCS_ROOT_URL } from './constants';

/**
 * get file source url in github repo
 * @param localPath local file absolute path
 */
export function fileSourceUrl(localPath: string) {
  const relativePath = relative(DOCS_ROOT, localPath);
  return `${DOCS_ROOT_URL}/${relativePath}`;
}