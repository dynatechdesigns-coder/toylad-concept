import { useState } from 'react'
import Button from '../components/ui/Button'
import AdminDialog from './AdminDialog'
import PhotoFields from './PhotoFields'
import { actionButton } from './fieldStyles'

export default function PhotoEditDialog({ photo, busy, error, onSave, onClose }) {
  const [values, setValues] = useState({ title: photo.title, category: photo.category })
  const [errors, setErrors] = useState({})

  const onSubmit = (event) => {
    event.preventDefault()
    const title = values.title.trim()
    if (!title) {
      setErrors({ title: 'Please give this photo a title.' })
      return
    }
    onSave({ title, category: values.category })
  }

  return (
    <AdminDialog title="Edit photo" onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="mt-6">
        <PhotoFields
          idPrefix="edit-photo"
          title={values.title}
          category={values.category}
          errors={errors}
          disabled={busy}
          onChange={(name, value) => {
            setValues((current) => ({ ...current, [name]: value }))
            setErrors({})
          }}
        />
        {error && (
          <p role="alert" className="mt-4 rounded-2xl border border-terracotta-deep bg-butter-soft p-3 text-base font-medium text-espresso">
            {error}
          </p>
        )}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="submit" size="lg" disabled={busy} className="w-full">
            {busy ? 'Saving…' : 'Save'}
          </Button>
          <button type="button" onClick={onClose} className={`${actionButton} min-h-14 w-full`}>
            Cancel
          </button>
        </div>
      </form>
    </AdminDialog>
  )
}
