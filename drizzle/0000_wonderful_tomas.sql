CREATE TABLE `alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`location` text NOT NULL,
	`severity` text NOT NULL,
	`description` text NOT NULL,
	`timestamp` text NOT NULL,
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `emergency_contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`number` text NOT NULL,
	`icon_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evacuation_routes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`route_from` text NOT NULL,
	`route_to` text NOT NULL,
	`status` text NOT NULL,
	`traffic` text NOT NULL,
	`distance` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `shelters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`capacity` integer NOT NULL,
	`available` integer NOT NULL,
	`amenities` text NOT NULL,
	`contact` text NOT NULL,
	`status` text NOT NULL,
	`distance` text
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`active_incidents` integer DEFAULT 0,
	`people_assisted` integer DEFAULT 0,
	`shelters_active` integer DEFAULT 0,
	`coverage_areas` integer DEFAULT 0,
	`last_updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weather_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`temperature` real NOT NULL,
	`wind_speed` real NOT NULL,
	`humidity` real NOT NULL,
	`conditions` text NOT NULL,
	`location` text NOT NULL,
	`timestamp` text NOT NULL
);
