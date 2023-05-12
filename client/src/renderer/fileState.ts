export interface FileState {
  name: string;
  value: string;
  defaultLanguage: string;
}

export const startupFile: FileState = {
  name: 'script.tnk',
  value: '',
  defaultLanguage: 'typescript',
};
