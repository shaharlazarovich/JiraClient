interface RegisterComponentProps {
    onMessage: (message: string, type: 'success' | 'error') => void;
    onLoaderChange: (show: boolean) => void;
  }