CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nomeCompleto` varchar(255) NOT NULL,
	`nacionalidade` varchar(100),
	`profissao` varchar(100),
	`estadoCivil` varchar(50),
	`rg` varchar(20) NOT NULL,
	`cpf` varchar(20) NOT NULL,
	`endereco` varchar(255) NOT NULL,
	`numero` varchar(20) NOT NULL,
	`complemento` varchar(100),
	`bairro` varchar(100) NOT NULL,
	`municipio` varchar(100) NOT NULL,
	`estado` varchar(2) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE TABLE `generated_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`documentType` enum('procuracao','contrato') NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`s3Key` varchar(500) NOT NULL,
	`s3Url` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generated_documents_id` PRIMARY KEY(`id`)
);
