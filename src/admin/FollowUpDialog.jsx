import { useState } from 'react'
import Modal from '../components/ui/Modal'
import WhatsAppLink from '../components/ui/WhatsAppLink'
import { followUpMessage } from '../data/crm'
import AdminField from './AdminField'
import { serviceLabel, whatsappTo } from './crmFormat'
import { actionButton, controlClass } from './fieldStyles'

// A ready-made follow-up message she can edit, then send from her own WhatsApp.
export default function FollowUpDialog({ lead, onSent, onClose }) {
  const [message, setMessage] = useState(() =>
    followUpMessage({ name: lead.customer.name, service: serviceLabel(lead.service) }),
  )

  return (
    <Modal title={`Message ${lead.customer.name}`} onClose={onClose}>
      <div className="mt-6">
        <AdminField id="follow-up-message" label="Your message (you can change it)">
          <textarea
            id="follow-up-message"
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={controlClass()}
          />
        </AdminField>
      </div>
      <p className="mt-3 text-sm text-espresso/75">WhatsApp opens with this message ready. Press send there.</p>

      <div className="mt-6 grid gap-3">
        {/* Opening WhatsApp counts as following up: the "Follow up" badge then rests for two days. */}
        <WhatsAppLink href={whatsappTo(lead.customer.phone, message)} className="w-full" onClick={onSent}>
          Open WhatsApp
        </WhatsAppLink>
        <button type="button" onClick={onClose} className={`${actionButton} min-h-12 w-full`}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}
