import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContatoSection from "@/components/ContatoSection";

export default function Contato() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-4 md:pt-28 md:pb-6 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Entre em Contato
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Estamos prontos para ajudá-lo com suas questões jurídicas
            </p>
          </div>
        </div>
      </section>

      {/* Formuláário de Contato */}
      <section className="py-2 md:py-3">
        <div className="container">
          <ContatoSection />
        </div>
      </section>

      <Footer />
    </div>
  );
}
