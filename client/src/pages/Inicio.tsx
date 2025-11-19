import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Inicio() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Silva & Repolho: Advogados Associados
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Atuação focada em Direito Previdenciário, Imobiliário e Sucessões.
              Defendemos seus interesses com experiência e dedicação.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <Link href="/contato">
                <Button size="lg" className="text-base px-8">
                  Agendar Consulta
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" className="text-base px-8">
                  Regularizar meu imóvel
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" className="text-base px-8">
                  Pedir benefício
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" className="text-base px-8">
                  Revisão do meu financiamento
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" className="text-base px-8">
                  Revisão de benefício
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" className="text-base px-8">
                  Fazer inventário
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
