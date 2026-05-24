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
    <div className="faq-accordion" role="list">
      {items.map((item, index) => {
        const isOpen = index === openIndex

        return (
          <article key={item.question} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} role="listitem">
            <button
              type="button"
              className="faq-item__trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="faq-item__question">{item.question}</span>
              <span className="faq-item__icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  className="faq-item__panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        )
      })}
    </div>
  )
}
