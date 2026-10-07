CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`learner` text NOT NULL,
	`concept` text NOT NULL,
	`format` text NOT NULL,
	`response` text NOT NULL,
	`correct` integer NOT NULL,
	`assisted` integer NOT NULL,
	`review` integer NOT NULL,
	`question` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attempts_owner_learner` ON `attempts` (`owner`,`learner`);--> statement-breakpoint
CREATE TABLE `drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`grade` integer NOT NULL,
	`concept` text NOT NULL,
	`content` text NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `drafts_owner` ON `drafts` (`owner`);--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`learner` text NOT NULL,
	`observation` text NOT NULL,
	`approach` text NOT NULL,
	`priority` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `feedback_owner_learner` ON `feedback` (`owner`,`learner`);--> statement-breakpoint
CREATE TABLE `learners` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`grade` integer NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `learners_owner` ON `learners` (`owner`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`note` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `reviews_owner` ON `reviews` (`owner`);--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`kind` text NOT NULL,
	`grade` integer,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sources_owner` ON `sources` (`owner`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`learner` text NOT NULL,
	`concept` text NOT NULL,
	`payload` text NOT NULL,
	`assisted` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `tasks_owner_learner` ON `tasks` (`owner`,`learner`);