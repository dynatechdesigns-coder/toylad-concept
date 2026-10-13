import { galleryCategories } from '../data/gallery'
import AdminField from './AdminField'
import { controlClass } from './fieldStyles'

// Title and category controls, shared by new uploads and the edit dialog.
export default function PhotoFields({ idPrefix, title, category, errors = {}, disabled, onChange }) {
  const titleId = `${idPrefix}-title`
  const categoryId = `${idPrefix}-category`

  return (
    <div className="grid gap-4">
      <AdminField id={titleId} label="Title" error={errors.title}>
        <input
          id={titleId}
          type="text"
          value={title}
          maxLength={80}
          required
          disabled={disabled}
          placeholder="e.g. Pink birthday cake"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          onChange={(event) => onChange('title', event.target.value)}
          className={controlClass(errors.title)}
        />
      </AdminField>

      <AdminField id={categoryId} label="Category" error={errors.category}>
        <select
          id={categoryId}
          value={category}
          required
          disabled={disabled}
          aria-invalid={errors.category ? true : undefined}
          aria-describedby={errors.category ? `${categoryId}-error` : undefined}
          onChange={(event) => onChange('category', event.target.value)}
          className={controlClass(errors.category)}
        >
          <option value="">Choose a category</option>
          {galleryCategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </AdminField>
    </div>
  )
}
