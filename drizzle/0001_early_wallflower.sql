ALTER TABLE `attempts` ADD `signature` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `last_seen` text DEFAULT '' NOT NULL;