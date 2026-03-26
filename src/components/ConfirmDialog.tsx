interface Props {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, confirmLabel = 'Delete', onConfirm, onCancel }: Props) {
  return (
    <div className="ch-overlay ch-overlay--center" onClick={onCancel}>
      <div className="ch-confirm-dialog" onClick={e => e.stopPropagation()}>
        <p className="ch-confirm-message">{message}</p>
        <div className="ch-confirm-actions">
          <button className="ch-btn ch-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="ch-btn ch-btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
