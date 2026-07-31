// client/src/components/layout/ConfirmDialog.jsx

import { useEffect, useRef } from 'react'

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const dialogRef = useRef(null)

  // keeps the native <dialog> element in sync with the open prop
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // clicking the backdrop (not the dialog's own content) cancels
  function handleClick(event) {
    if (event.target === dialogRef.current) {
      onCancel()
    }
  }

  return (
    <dialog ref={dialogRef} className="confirm-dialog" onCancel={onCancel} onClick={handleClick}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="confirm-dialog-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="button-danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
