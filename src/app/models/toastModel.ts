export interface ToastModel {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration: number;
    position: 'top-right' | 'top-left' | 'top-center' | 'bottom-center' | 'bottom-right' | 'bottom-left';
    icon?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}
