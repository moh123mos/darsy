import type { AppDataEnvelope, DayKey } from '../types/schedule'

export interface SampleSession {
  studentName: string
  subtitle: string
  startTime: string
  durationMinutes: number
  type: string
}

export const sampleData: Record<DayKey, SampleSession[]> = {
  saturday: [],
  sunday: [
    { studentName: 'عبد العزيز', subtitle: 'المستوى: صف رابع', startTime: '13:00', durationMinutes: 60, type: 'جلسة تعليمية' },
    { studentName: 'تميم (أم سلمان)', subtitle: 'المستوى: صف سادس', startTime: '14:00', durationMinutes: 60, type: 'جلسة تعليمية' },
    { studentName: 'حلقة القرآن', subtitle: 'جمعية خاتم المرسلين', startTime: '16:00', durationMinutes: 120, type: 'نشاط ديني' },
    { studentName: 'مؤيد الشديدي', subtitle: 'المستوى: صف خامس', startTime: '20:30', durationMinutes: 60, type: 'جلسة تعليمية' }
  ],
  monday: [
    { studentName: 'تميم (أم سلمان)', subtitle: 'المستوى: صف سادس', startTime: '14:00', durationMinutes: 60, type: 'جلسة تعليمية' },
    { studentName: 'مؤيد الشديدي', subtitle: 'المستوى: صف خامس', startTime: '20:30', durationMinutes: 60, type: 'جلسة تعليمية' }
  ],
  tuesday: [
    { studentName: 'مؤيد الشديدي', subtitle: 'المستوى: صف خامس', startTime: '20:30', durationMinutes: 60, type: 'جلسة تعليمية' }
  ],
  wednesday: [
    { studentName: 'مؤيد الشديدي', subtitle: 'المستوى: صف خامس', startTime: '20:30', durationMinutes: 60, type: 'جلسة تعليمية' }
  ],
  thursday: [],
  friday: []
}

export function applySampleData(data: AppDataEnvelope): AppDataEnvelope {
  const updatedData = { ...data }

  for (const day of updatedData.days) {
    day.sessions = []
    const samples = sampleData[day.key]
    if (samples) {
      day.sessions = samples.map(s => ({
        ...s,
        id: crypto.randomUUID(),
        dayKey: day.key,
        notes: ''
      }))
    }
  }

  return updatedData
}