import { useState } from 'react'
import packageGroups from '../../data/packages'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Tabs from '../ui/Tabs'
import PackageCard from './PackageCard'

const tabs = packageGroups.map((group) => ({ id: group.id, label: group.label }))

export default function Packages({ setBookingPreset }) {
  const [groupId, setGroupId] = useState(packageGroups[0].id)
  const group = packageGroups.find((item) => item.id === groupId)

  return (
    <section id="packages" className="scroll-mt-24 bg-butter-soft py-20 md:py-28">
      <Container>
        <SectionHeading
          tone="soft"
          eyebrow="Packages"
          title="Popular treats & packages"
          subtitle="Start from one of our most-requested options, then make it yours."
        />

        <div className="mt-10 flex justify-center md:mt-12">
          <Tabs
            tabs={tabs}
            value={groupId}
            onChange={setGroupId}
            idPrefix="packages"
            label="Package type"
            variant="segmented"
          />
        </div>

        <div key={groupId} id="packages-panel" role="tabpanel" aria-labelledby={`packages-tab-${groupId}`}>
          <ul className="mx-auto mt-12 grid max-w-md animate-pop-in gap-8 lg:max-w-none lg:grid-cols-3 lg:px-4">
            {group.tiers.map((tier) => (
              <li key={tier.id}>
                <PackageCard
                  tier={tier}
                  groupLabel={group.label}
                  onSelect={() => setBookingPreset({ service: group.service, package: tier.id })}
                />
              </li>
            ))}
          </ul>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-espresso/70 lg:mt-14">
          Every order is unique. Message us for a friendly quote tailored to your event.
        </p>
      </Container>
    </section>
  )
}
