import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] text-black selection:bg-black selection:text-white pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-12">About Shion</h1>
        
        <div className="relative w-full aspect-video mb-16 rounded-3xl overflow-hidden bg-black/5 shadow-lg">
          <Image 
            src="https://picsum.photos/seed/shion/1200/600" 
            alt="Photographer in Seoul" 
            fill 
            className="object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-8 text-xl text-gray-600 leading-relaxed">
          <p>
            <strong className="text-black font-medium">Shion Photography</strong> was born out of a simple desire: to capture the fleeting, cinematic moments of life in one of the world&apos;s most dynamic cities. Seoul is a city of contrasts—where ancient palaces sit beside neon-lit skyscrapers, and tranquil mountain trails overlook bustling night markets.
          </p>
          <p>
            Founded by lead photographer Shion Park, our studio specializes in creating aesthetic, high-quality visual narratives for both locals and international visitors. We believe that a photo session shouldn&apos;t feel like a stiff, formal chore. Instead, it should be an experience—a guided exploration of the city where you can be your authentic self.
          </p>
          
          <h2 className="text-3xl font-medium text-black mt-16 mb-6 tracking-tight">Our Philosophy</h2>
          <p>
            We focus on natural light, candid moments, and the unique geometry of Seoul&apos;s urban landscape. Whether we&apos;re shooting a quick solo portrait in Myeongdong or a full-day editorial experience across the Han River, our goal is to deliver images that feel timeless and deeply personal.
          </p>
          
          <h2 className="text-3xl font-medium text-black mt-16 mb-6 tracking-tight">The Experience</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong className="text-black font-medium">Tailored Locations:</strong> We know the hidden alleys, the best sunset spots, and the most vibrant neon backdrops.</li>
            <li><strong className="text-black font-medium">Effortless Direction:</strong> Not a professional model? No problem. We provide gentle, natural direction to help you look your best.</li>
            <li><strong className="text-black font-medium">Premium Editing:</strong> Every photo is carefully color-graded to match our signature cinematic style.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
