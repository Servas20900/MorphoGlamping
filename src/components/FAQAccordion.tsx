import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type FAQItem = {
  question: string
  answer: string
}

type FAQAccordionProps = {
  items: FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="grid gap-2" role="list">
      {items.map((item, index) => {
        const isOpen = index === openIndex

        return (
          <article
            key={item.question}
            role="listitem"
            className={[
              'border rounded-section overflow-clip transition-colors duration-200',
              isOpen ? 'bg-white/80 border-accent/20' : 'bg-white/60 border-black/[.07]',
            ].join(' ')}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 px-[1.15rem] py-4 border-0 bg-transparent text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="font-heading text-[clamp(.95rem,1.3vw,1.05rem)] tracking-[-0.02em] font-semibold leading-[1.35]">
                {item.question}
              </span>
              <span className="relative flex-shrink-0 w-[1.4rem] h-[1.4rem]" aria-hidden="true">
                <span className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-px bg-ink" />
                <span
                  className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-px bg-ink transition-transform duration-200"
                  style={{ transform: isOpen ? 'translateY(-50%) rotate(0deg)' : 'translateY(-50%) rotate(90deg)' }}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  className="overflow-hidden px-[1.15rem] pb-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="m-0 text-muted text-[0.9rem] leading-[1.65]">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        )
      })}
    </div>
  )
}
