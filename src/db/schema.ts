import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const alerts = sqliteTable('alerts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  location: text('location').notNull(),
  severity: text('severity').notNull(),
  description: text('description').notNull(),
  timestamp: text('timestamp').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

export const weatherData = sqliteTable('weather_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  temperature: real('temperature').notNull(),
  windSpeed: real('wind_speed').notNull(),
  humidity: real('humidity').notNull(),
  conditions: text('conditions').notNull(),
  location: text('location').notNull(),
  timestamp: text('timestamp').notNull(),
});

export const stats = sqliteTable('stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  activeIncidents: integer('active_incidents').default(0),
  peopleAssisted: integer('people_assisted').default(0),
  sheltersActive: integer('shelters_active').default(0),
  coverageAreas: integer('coverage_areas').default(0),
  lastUpdated: text('last_updated').notNull(),
});

export const shelters = sqliteTable('shelters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  capacity: integer('capacity').notNull(),
  available: integer('available').notNull(),
  amenities: text('amenities', { mode: 'json' }).notNull(),
  contact: text('contact').notNull(),
  status: text('status').notNull(),
  distance: text('distance'),
});

export const evacuationRoutes = sqliteTable('evacuation_routes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  routeFrom: text('route_from').notNull(),
  routeTo: text('route_to').notNull(),
  status: text('status').notNull(),
  traffic: text('traffic').notNull(),
  distance: text('distance').notNull(),
  description: text('description'),
});

export const emergencyContacts = sqliteTable('emergency_contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category').notNull(),
  name: text('name').notNull(),
  number: text('number').notNull(),
  iconName: text('icon_name').notNull(),
});