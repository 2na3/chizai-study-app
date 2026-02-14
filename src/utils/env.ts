// Check if the app is in read-only mode
export const isReadOnlyMode = (): boolean => {
  return import.meta.env.VITE_READ_ONLY_MODE === 'true';
};
