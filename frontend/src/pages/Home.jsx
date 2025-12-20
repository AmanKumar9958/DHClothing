import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import Exclusive from '../components/Exclusive'
import FadeIn from '../components/FadeIn'

const Home = () => {
  return (
    <div>
      <FadeIn>
        <Hero />
      </FadeIn>
      <FadeIn>
        <LatestCollection/>
      </FadeIn>
      <FadeIn>
        <Exclusive/>
      </FadeIn>
      <FadeIn>
        <BestSeller/>
      </FadeIn>
      <FadeIn>
        <OurPolicy/>
      </FadeIn>
    </div>
  )
}

export default Home
