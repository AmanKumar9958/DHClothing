import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import Exclusive from '../components/Exclusive'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection/>
      <Exclusive/>
      <BestSeller/>
  <OurPolicy/>
    </div>
  )
}

export default Home
