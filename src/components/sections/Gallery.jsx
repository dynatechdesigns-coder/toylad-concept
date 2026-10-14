import { Suspense, lazy, useMemo, useState } from 'react'
import stockPhotos, { galleryCategories, showStockPhotos } from '../../data/gallery'
import useUploadedPhotos from '../../hooks/useUploadedPhotos'
import { buildGallery } from '../../utils/gallery'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Tabs from '../ui/Tabs'
import GalleryGrid from './GalleryGrid'
import GalleryLightbox from './GalleryLightbox'
import GalleryMore from './GalleryMore'

// Owner-only tools. Loaded only after the server confirms the owner is logged in.
const OwnerGalleryTools = lazy(() => import('../../admin/OwnerGalleryTools'))
const categoryById = Object.fromEntries(galleryCategories.map((category) => [category.id, category]))

export default function Gallery({ setBookingPreset, isOwner, onOwnerSignedOut }) {
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)
  const { items: uploaded, reload } = useUploadedPhotos()

  const view = useMemo(() => buildGallery(uploaded, stockPhotos, showStockPhotos), [uploaded])
  // Category tabs count the photos they show (at most 8); "All" is a short selection, so it has no count.
  const tabs = useMemo(
    () => [
      { id: 'all', label: 'All' },
      ...galleryCategories.map(({ id, label }) => ({ id, label, count: view.byCategory[id].length })),
    ],
    [view],
  )

  const items = filter === 'all' ? view.all : view.byCategory[filter]
  const openIndex = items.findIndex((item) => item.id === openId)
  const openItem = items[openIndex]
  const step = (offset) => setOpenId(items[(openIndex + offset + items.length) % items.length].id)

  const jumpTo = (id) => {
    setFilter(id)
    const tab = document.getElementById(`gallery-tab-${id}`)
    tab?.scrollIntoView({ block: 'center' })
    tab?.focus({ preventScroll: true })
  }

  const renderPhotos = (actionsFor) => (
    <>
      <Tabs
        tabs={tabs}
        value={filter}
        onChange={setFilter}
        idPrefix="gallery"
        label="Filter gallery by category"
        className="-mx-4 mt-10 px-4 sm:mx-0 sm:px-1 md:mt-12"
      />
      <GalleryGrid filter={filter} items={items} categoryById={categoryById} onOpen={setOpenId} actionsFor={actionsFor} />
      <GalleryMore filter={filter} empty={items.length === 0} onJump={jumpTo} />
    </>
  )

  return (
    <section id="gallery" className="scroll-mt-24 bg-cream py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Portfolio & Menu"
          title="A taste of our work"
          subtitle="Browse recent cakes, treats and events. Tap any piece for details and to order something similar."
        />
        {isOwner ? (
          <Suspense fallback={renderPhotos(null)}>
            <OwnerGalleryTools onChanged={reload} onSignedOut={onOwnerSignedOut}>
              {renderPhotos}
            </OwnerGalleryTools>
          </Suspense>
        ) : (
          renderPhotos(null)
        )}
      </Container>

      {openItem && (
        <GalleryLightbox
          item={openItem}
          category={categoryById[openItem.category]}
          position={openIndex + 1}
          total={items.length}
          onClose={() => setOpenId(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          setBookingPreset={setBookingPreset}
        />
      )}
    </section>
  )
}
