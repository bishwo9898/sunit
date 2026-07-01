import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { SEO_CONFIG } from "@/config/seo";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "About | Fortunnes Efe - Wedding & Portrait Photographer",
  description:
    "Learn more about Fortunnes Efe, a Nigerian photographer based in Lubbock, Texas, specializing in editorial wedding and portrait photography with a focus on skin tone care.",
};

export default function AboutPage() {
  return (
    <main className={`min-h-screen bg-[#fafafa] text-neutral-900 ${bodyFont.variable} ${displayFont.variable}`}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Image Column */}
            <div 
              className="lg:col-span-5 relative"
              data-aos="fade-right"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/optimized/portraits/ff1.jpg"
                  alt="Fortunnes Efe"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-neutral-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-neutral-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            </div>

            {/* Text Column */}
            <div 
              className="lg:col-span-7"
              data-aos="fade-left"
            >
              <span className="inline-block text-sm uppercase tracking-[0.3em] text-neutral-400 mb-6 font-medium">
                The Artist Behind the Lens
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-[1.1] mb-8">
                I&apos;m Fortunnes Efe.
              </h1>
              <div className="space-y-6 text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl">
                <p>
                  I&apos;m a Nigerian photographer based in Lubbock, balancing pharmacy school with the privilege of capturing love stories across Texas and beyond.
                </p>
                <p>
                  I&apos;ve been taking pictures for over eight years, and wedding photography for three plus years — and every couple I&apos;ve ever shot has told me the same thing: <span className="text-neutral-900 italic font-medium">&quot;You captured how we felt.&quot;</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white border-y border-neutral-100">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 
            className="text-3xl md:text-5xl font-display italic mb-10"
            data-aos="fade-up"
          >
            &quot;That&apos;s everything to me.&quot;
          </h2>
          <div 
            className="text-xl md:text-2xl text-neutral-500 font-light leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <p className="mb-8">
              I shoot editorially because I believe photos need to <span className="text-neutral-900 font-medium">feel something</span>. A technically perfect image means nothing if it doesn&apos;t move you.
            </p>
            <p>
              I&apos;m obsessed with capturing the moments that matter most — the laughter in the bridal suite, your dad&apos;s first real smile of the day, the pure joy on the dance floor.
            </p>
          </div>
        </div>
      </section>

      {/* Invisible but Everywhere Section */}
      <section className="py-24 px-6 md:px-10 lg:px-16 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-up">
              <h3 className="text-4xl md:text-5xl font-display mb-8">
                Invisible, yet Everywhere.
              </h3>
              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                I&apos;m the one who&apos;s close enough to feel the energy without being in the way. I want to capture the raw, unscripted beauty of your day while ensuring you feel completely at ease.
              </p>
              <div className="h-px w-24 bg-neutral-900" />
            </div>
            <div 
              className="relative aspect-video rounded-2xl overflow-hidden shadow-lg"
              data-aos="zoom-in"
            >
              <Image
                src="/optimized/weddings/eunice-four.jpg"
                alt="Wedding moment"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skin Tone Care Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div 
              className="relative aspect-[3/4] lg:order-2 rounded-2xl overflow-hidden"
              data-aos="fade-left"
            >
              <Image
                src="/optimized/portraits/golden-1.jpg"
                alt="Radiant skin tone portrait"
                fill
                className="object-cover opacity-90"
              />
            </div>
            <div data-aos="fade-right">
              <span className="text-sm uppercase tracking-widest text-neutral-400 mb-6 block">The Shutter Unit Difference</span>
              <h2 className="text-4xl md:text-6xl font-display mb-8 leading-tight">
                Skin Tone Care as a Priority.
              </h2>
              <div className="space-y-6 text-lg text-neutral-300 leading-relaxed">
                <p>
                  I&apos;ve shot couples across different races, cultures, and backgrounds, and I&apos;ve learned something crucial that most photographers overlook: <span className="text-white font-medium italic">skin tone care</span>.
                </p>
                <p>
                  When you&apos;re photographing interracial couples, darker and lighter skin need to be handled with intention and care. I put real effort into making sure both of you look as beautiful as you feel, regardless of background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everafter Section */}
      <section className="py-32 px-6 md:px-10 lg:px-16 bg-white overflow-hidden">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-5xl md:text-7xl font-display mb-10">
              Everafter by ShutterUnit.
            </h2>
            <div className="relative inline-block">
               <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 to-neutral-100 blur-lg opacity-50" />
               <p className="relative text-lg italic text-neutral-500 max-w-2xl mx-auto">
                 &quot;I&apos;ve always loved a good rom com, that Disney happily ever after feeling.&quot;
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div 
              className="aspect-[4/5] relative rounded-xl overflow-hidden shadow-md"
              data-aos="fade-up" 
              data-aos-delay="100"
            >
              <Image src="/optimized/weddings/eunice-two.jpg" alt="Wedding detail" fill className="object-cover" />
            </div>
            <div 
              className="aspect-[4/5] relative rounded-xl overflow-hidden shadow-xl md:-translate-y-8"
              data-aos="fade-up" 
              data-aos-delay="200"
            >
              <Image src="/optimized/weddings/eunice-three.jpg" alt="Wedding detail" fill className="object-cover" />
            </div>
            <div 
              className="aspect-[4/5] relative rounded-xl overflow-hidden shadow-md"
              data-aos="fade-up" 
              data-aos-delay="300"
            >
              <Image src="/optimized/weddings/eunice-onr.jpg" alt="Wedding detail" fill className="object-cover" />
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-xl text-neutral-600 leading-relaxed text-center" data-aos="fade-up">
            <p className="mb-8">
              But here&apos;s the reality: your wedding day is temporary. The hair fades, the makeup comes off, the flowers wilt. 
            </p>
            <p className="mb-0 text-2xl text-neutral-900 font-display italic">
              Your photos and video are what remain. They&apos;re the only thing that echoes forever.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-24 bg-[#fafafa]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div data-aos="zoom-in">
            <p className="text-2xl md:text-3xl text-neutral-800 leading-relaxed font-light mb-12">
              I want you to look at them and feel like you&apos;re living in your own love story — because you are.
            </p>
            <p className="text-xl text-neutral-900 font-medium tracking-wide mb-16">
              Wherever your love takes you across Texas or beyond, I&apos;ll be there to make sure it lives forever.
            </p>
            
            <Link 
              href="/contact"
              className="inline-block bg-neutral-900 text-white px-12 py-5 rounded-full text-lg font-medium tracking-wide hover:bg-neutral-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Let&apos;s capture your story
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
