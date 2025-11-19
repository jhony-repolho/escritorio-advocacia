import ContactForm from "./ContactForm";

export default function ContatoSection() {
  return (
    <section id="contato" className="py-0">
      <div className="container">
        {/* Formulário de Contato */}
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
