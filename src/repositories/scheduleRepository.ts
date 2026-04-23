import type { AppDataEnvelope } from '../types/schedule'
import type { RecoveryResult } from './localScheduleRepository'

export interface IScheduleRepository {
  getAppData(): AppDataEnvelope | null
  saveAppData(data: AppDataEnvelope): void
  createDefaultData(): AppDataEnvelope
  validateAndMigrate(data: unknown): AppDataEnvelope | null
  recoverFromBackup(): RecoveryResult
  exportData(): string
  importData(json: string): boolean
  clearAllData(): void
}