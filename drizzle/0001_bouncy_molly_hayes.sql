CREATE TABLE `trainingProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileJson` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trainingProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `trainingProgress_userId_unique` UNIQUE(`userId`)
);
