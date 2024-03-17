export enum ModalConfirmTypes {
  DEFAULT = 'default',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface ModalConfirmProps {
  title: string;
  subTitle?: string;
  action?: string;
  cancel?: string;
  onlyConfirm?: boolean;
  pendingAction?: boolean;
  clickToClose?: boolean;
  type?: ModalConfirmTypes;
}
