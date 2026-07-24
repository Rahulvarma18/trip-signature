import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import PopularDestinations from '../components/PopularDestinations'
// import Packages from '../components/Packages'
import WhyUs from '../components/WhyUs'
import InquirySection from '../components/InquirySection'
// import Journal from '../components/Journal'
import Testimonials from '../components/Testimonials'
import CategoryCarousel from '../components/CategoryCarousel'

export default function HomePage({
    onSearch,
    activeCategory,
    onSelectCategory,
    searchTerm,
    onClearSearch,
    presetDestination
}) {
    return (
        <div id="top">
            <Hero />
            <TrustStrip />
            <CategoryCarousel></CategoryCarousel>
            <PopularDestinations />
            {/* <Packages
                activeCategory={activeCategory}
                onSelectCategory={onSelectCategory}
                searchTerm={searchTerm}
                onClearSearch={onClearSearch}
            /> */}
            <WhyUs />
            <InquirySection presetDestination={presetDestination} />
            {/* <Journal /> */}
            <Testimonials />
        </div>
    )
}