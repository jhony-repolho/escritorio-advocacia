import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { clients } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const clientsRouter = router({
  saveClient: publicProcedure
    .input(z.object({
      nomeCompleto: z.string(),
      nacionalidade: z.string().optional(),
      profissao: z.string().optional(),
      estadoCivil: z.string().optional(),
      rg: z.string(),
      cpf: z.string(),
      endereco: z.string(),
      numero: z.string().optional(),
      complemento: z.string().optional(),
      bairro: z.string(),
      municipio: z.string(),
      estado: z.string(),
      telefone: z.string(),
      email: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Verificar se cliente já existe pelo CPF
      const existingClient = await db
        .select()
        .from(clients)
        .where(eq(clients.cpf, input.cpf))
        .limit(1);

      let clientId: number;

      if (existingClient.length > 0) {
        // Atualizar cliente existente
        clientId = existingClient[0].id;
        await db
          .update(clients)
          .set({
            nomeCompleto: input.nomeCompleto,
            nacionalidade: input.nacionalidade,
            profissao: input.profissao,
            estadoCivil: input.estadoCivil,
            rg: input.rg,
            endereco: input.endereco,
            numero: input.numero,
            complemento: input.complemento,
            bairro: input.bairro,
            municipio: input.municipio,
            estado: input.estado,
            telefone: input.telefone,
            email: input.email,
          })
          .where(eq(clients.id, clientId));
      } else {
        // Criar novo cliente
        const clientData = {
          nomeCompleto: input.nomeCompleto,
          nacionalidade: input.nacionalidade || null,
          profissao: input.profissao || null,
          estadoCivil: input.estadoCivil || null,
          rg: input.rg,
          cpf: input.cpf,
          endereco: input.endereco,
          numero: input.numero || null,
          complemento: input.complemento || null,
          bairro: input.bairro,
          municipio: input.municipio,
          estado: input.estado,
          telefone: input.telefone,
          email: input.email,
        };
        const result = await db.insert(clients).values([clientData as any]);
        clientId = (result as any).insertId as number;
      }

      return { clientId, success: true };
    }),

  getClient: publicProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const client = await db
        .select()
        .from(clients)
        .where(eq(clients.id, input.clientId))
        .limit(1);

      return client[0] || null;
    }),
});
