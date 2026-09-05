import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Architecture from './components/Architecture';
import Work from './components/Work';
import Experience from './components/Experience';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main>
          <Hero />
          <Architecture />
          <Work />
          <Experience />
          <About />
          <Contact />
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </MotionConfig>
  );
}

export default App;
