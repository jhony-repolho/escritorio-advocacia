import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle } from "lucide-react";

export default function Artigos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-4 md:pt-28 md:pb-6 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Artigos Jurídicos
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Conheça nossos artigos sobre Direito Previdenciário, Imobiliário e Família e Sucessões
            </p>
          </div>
        </div>
      </section>

      {/* Em Construção */}
      <section className="py-2 md:py-3 flex-1">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-muted p-12 rounded-lg">
              <AlertCircle className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Em Construção</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Estamos preparando conteúdo jurídico de qualidade para você. 
                Em breve, você terá acesso a artigos completos sobre Direito Previdenciário, 
                Imobiliário e Família e Sucessões.
              </p>
              <p className="text-muted-foreground mb-8">
                Enquanto isso, entre em contato conosco para esclarecer suas dúvidas!
              </p>
              <Link href="/contato">
                <Button size="lg">
                  Agendar Consulta
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
