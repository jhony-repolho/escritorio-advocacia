import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculadoraRevisional from "@/components/CalculadoraRevisional";

export default function Calculadora() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-4 md:pt-28 md:pb-6 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Calculadora Revisional
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Analise seu contrato imobiliário e verifique se você tem direito a revisão
            </p>
          </div>
        </div>
      </section>

      {/* Calculadora */}
      <section className="py-2 md:py-3">
        <div className="container">
          <CalculadoraRevisional />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Resultado Positivo?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Se você tem direito a revisão, entre em contato conosco para iniciar o processo judicial.
            </p>
            <Link href="/contato">
              <Button size="lg">
                Iniciar Processo Judicial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
