import dynamic from 'next/dynamic'
import CamFramesSequence from '../components/CamFramesSequence'
import Hero from '../components/Hero'

const About = dynamic(() => import('../components/About'), {
  ssr: false,
  loading: () => <div className="h-screen bg-ssp-darker" />,
})

const Services = dynamic(() => import('../components/Services'), {
  ssr: false,
  loading: () => <div className="h-screen bg-ssp-darker" />,
})

const Portfolio = dynamic(() => import('../components/Portfolio'), {
  ssr: false,
  loading: () => <div className="h-screen bg-ssp-darker" />,
})

const Testimonials = dynamic(() => import('../components/Testimonials'), {
  ssr: false,
  loading: () => <div className="h-screen bg-ssp-darker" />,
})

const Booking = dynamic(() => import('../components/Booking'), {
  ssr: false,
  loading: () => <div className="h-screen bg-ssp-darker" />,
})

export default function Home() {
  return (
    <>
      <CamFramesSequence />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Booking />
    </>
  )
}
