import type { PropsWithChildren } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type RevealProps = PropsWithChildren<HTMLMotionProps<'div'> & { delay?: number }>

export function Reveal({ children, className, delay = 0, ...rest }: RevealProps) {
  return (
    <motion.div
      className={className}
      {...rest}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px -5% 0px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
