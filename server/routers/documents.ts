import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const execAsync = promisify(exec);

export const documentsRouter = router({
  generateDocuments: publicProcedure
    .input(
      z.object({
        nomeCompleto: z.string(),
        nacionalidade: z.string(),
        profissao: z.string(),
        estadoCivil: z.string(),
        rg: z.string(),
        cpf: z.string(),
        endereco: z.string(),
        numero: z.string(),
        complemento: z.string().optional(),
        bairro: z.string(),
        municipio: z.string(),
        estado: z.string(),
        dataAtual: z.string().optional(),
      })
    )
    .mutation(async ({ input }: any) => {
      try {
        const dataAtual = input.dataAtual || new Date().toLocaleDateString("pt-BR");
        
        // Dados para preencher os templates
        const dados = {
          Nome: input.nomeCompleto,
          nacionalidade: input.nacionalidade,
          profissao: input.profissao,
          "estado civil": input.estadoCivil,
          Identidade: input.rg,
          CPF: input.cpf,
          endereco: input.endereco,
          "nº": input.numero,
          complemento: input.complemento || "",
          bairro: input.bairro,
          municipio: input.municipio,
          Estado: input.estado,
          "data atual": dataAtual,
        };

        const templatesDir = path.join(process.cwd(), "server", "templates");
        const outputDir = path.join(process.cwd(), "client", "public", "documentos");

        // Criar diretório de saída se não existir
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const documentos = [];

        // Gerar Procuração
        try {
          const procuracaoPath = path.join(templatesDir, "xx-Procuração-Geral.docx");
          
          if (fs.existsSync(procuracaoPath)) {
            // Ler o template
            const content = fs.readFileSync(procuracaoPath, "binary");
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
              linebreaks: true,
            });

            // Preencher os dados
            doc.setData(dados);
            doc.render();

            // Gerar DOCX preenchido
            const buf = doc.getZip().generate({ type: "nodebuffer" });
            const procuracaoPreenchidaPath = path.join(outputDir, `Procuracao_preenchida_${input.cpf.replace(/\D/g, "")}.docx`);
            fs.writeFileSync(procuracaoPreenchidaPath, buf);

            // Converter para PDF usando LibreOffice
            await execAsync(`libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${procuracaoPreenchidaPath}"`);
            
            // Renomear o PDF gerado
            const pdfGerado = path.join(outputDir, `Procuracao_preenchida_${input.cpf.replace(/\D/g, "")}.pdf`);
            const pdfFinal = path.join(outputDir, `Procuracao_${input.cpf.replace(/\D/g, "")}.pdf`);
            
            if (fs.existsSync(pdfGerado)) {
              fs.renameSync(pdfGerado, pdfFinal);
              documentos.push({
                nome: "Procuração",
                url: `/documentos/Procuracao_${input.cpf.replace(/\D/g, "")}.pdf`,
              });
            }
          }
        } catch (error) {
          console.error("Erro ao gerar Procuração:", error);
        }

        // Gerar Contrato
        try {
          const contratoPath = path.join(templatesDir, "xx-Contratocível.docx");
          
          if (fs.existsSync(contratoPath)) {
            // Ler o template
            const content = fs.readFileSync(contratoPath, "binary");
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
              linebreaks: true,
            });

            // Preencher os dados
            doc.setData(dados);
            doc.render();

            // Gerar DOCX preenchido
            const buf = doc.getZip().generate({ type: "nodebuffer" });
            const contratoPreenchidoPath = path.join(outputDir, `Contrato_preenchido_${input.cpf.replace(/\D/g, "")}.docx`);
            fs.writeFileSync(contratoPreenchidoPath, buf);

            // Converter para PDF usando LibreOffice
            await execAsync(`libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${contratoPreenchidoPath}"`);
            
            // Renomear o PDF gerado
            const pdfGerado = path.join(outputDir, `Contrato_preenchido_${input.cpf.replace(/\D/g, "")}.pdf`);
            const pdfFinal = path.join(outputDir, `Contrato_${input.cpf.replace(/\D/g, "")}.pdf`);
            
            if (fs.existsSync(pdfGerado)) {
              fs.renameSync(pdfGerado, pdfFinal);
              documentos.push({
                nome: "Contrato de Prestação de Serviços",
                url: `/documentos/Contrato_${input.cpf.replace(/\D/g, "")}.pdf`,
              });
            }
          }
        } catch (error) {
          console.error("Erro ao gerar Contrato:", error);
        }

        return {
          sucesso: true,
          documentos,
          mensagem: "Documentos gerados com sucesso",
        };
      } catch (error) {
        console.error("Erro ao gerar documentos:", error);
        return {
          sucesso: false,
          documentos: [],
          mensagem: "Erro ao gerar documentos",
        };
      }
    }),
});
