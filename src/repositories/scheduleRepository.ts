import type { AppDataEnvelope } from '../types/schedule'

export interface IScheduleRepository {
  getAppData(): AppDataEnvelope | null
  saveAppData(data: AppDataEnvelope): void
  createDefaultData(): AppDataEnvelope
  validateAndMigrate(data: unknown): AppDataEnvelope | null
}