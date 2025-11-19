CREATE TABLE `daily_indices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`indexType` enum('INCC','IPCA') NOT NULL,
	`date` varchar(10) NOT NULL,
	`dailyIndex` decimal(15,12) NOT NULL,
	`accumulated` decimal(15,12) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_indices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monthly_indices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`indexType` enum('INCC','IPCA') NOT NULL,
	`date` varchar(10) NOT NULL,
	`monthlyIndex` decimal(10,8) NOT NULL,
	`dailyIndex` decimal(15,12) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `monthly_indices_id` PRIMARY KEY(`id`)
);
