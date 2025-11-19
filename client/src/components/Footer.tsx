import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Silva & Repolho</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advogados Associados especializados em Direito Previdenciário, Imobiliário e Família e Sucessões.
              Atendimento personalizado e comprometido com seus direitos.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              CNPJ: 26.068.993/0001-27
            </p>
          </div>

          {/* Áreas de Atuação */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Áreas de Atuação</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Direito Previdenciário</li>
              <li>Direito Imobiliário</li>
              <li>Direito de Família e Sucessões</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="https://wa.me/5591983190800?text=Ol%C3%A1%21%20Gostaria%20de%20agendar%20uma%20consulta%20com%20a%20Silva%20%26%20Repolho%20Advogados." target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>(91) 98319-0800</span>
                  <MessageCircle className="h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contato@silvarepolho.com.br" className="hover:text-primary transition-colors">
                  contato@silvarepolho.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Rua Dois de Junho, nº 7, Centro, Ananindeua-PA, CEP 67030-005</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Silva & Repolho: Advogados Associados. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
