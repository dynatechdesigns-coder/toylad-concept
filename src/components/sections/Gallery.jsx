import { useMemo, useState } from 'react'
import gallery, { galleryCategories, showStockPhotos } from '../../data/gallery'
import useUploadedPhotos from '../../hooks/useUploadedPhotos'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Tabs from '../ui/Tabs'
import GalleryCard from './GalleryCard'
import GalleryLightbox from './GalleryLightbox'

const stockPhotos = showStockPhotos ? gallery : []
const categoryById = Object.fromEntries(galleryCategories.map((category) => [category.id, category]))
// Cycled by position to give the columns a masonry feel.
const aspects = ['4 / 5', '1 / 1', '3 / 4', '4 / 3', '1 / 1']

export default function Gallery({ setBookingPreset }) {
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)
  const uploaded = useUploadedPhotos()

  // The owner's uploads come first, then the stock photos.
  const all = useMemo(() => [...uploaded, ...stockPhotos], [uploaded])
  const tabs = useMemo(
    () => [
      { id: 'all', label: 'All', count: all.length },
      ...galleryCategories.map((category) => ({
        id: category.id,
        label: category.label,
        count: all.filter((item) => item.category === category.id).length,
      })),
    ],
    [all],
  )
  const items = filter === 'all' ? all : all.filter((item) => item.category === filter)
  const openIndex = items.findIndex((item) => item.id === openId)
  const openItem = items[openIndex]
  const step = (offset) => setOpenId(items[(openIndex + offset + items.length) % items.length].id)

  return (
    <section id="gallery" className="scroll-mt-24 bg-cream py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Portfolio & Menu"
          title="A taste of our work"
          subtitle="Browse recent cakes, treats and events. Tap any piece for details and to order something similar."
        />

        <Tabs
          tabs={tabs}
          value={filter}
          onChange={setFilter}
          idPrefix="gallery"
          label="Filter gallery by category"
          className="-mx-4 mt-10 px-4 sm:mx-0 sm:px-1 md:mt-12"
        />

        <div
          key={filter}
          id="gallery-panel"
          role="tabpanel"
          aria-labelledby={`gallery-tab-${filter}`}
          className="mt-8 columns-2 gap-6 md:mt-10 md:columns-3 md:gap-8 lg:columns-4"
        >
          {items.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              categoryLabel={categoryById[item.category].label}
              aspect={aspects[index % aspects.length]}
              onOpen={() => setOpenId(item.id)}
            />
          ))}
        </div>
        {items.length === 0 && <p className="mt-8 text-center text-base text-espresso/75">New photos are coming soon.</p>}
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
