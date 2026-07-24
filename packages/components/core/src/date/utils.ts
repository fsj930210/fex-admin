import { Temporal } from '../calendar/temporal'
import type { CalendarDate, CalendarQuarter, CalendarWeekday, CalendarYear } from '../calendar/types'
import type { TimeValue } from '../time-picker/types'

export interface CalendarDateFields {
  year?: number
  month?: number
  day?: number
}

export interface CalendarDateDuration {
  years?: number
  months?: number
  weeks?: number
  days?: number
}

export type CalendarDateUnit = 'day' | 'week' | 'month' | 'quarter' | 'year'

export function setDate(date: CalendarDate, fields: CalendarDateFields): CalendarDate {
  return date.with(fields)
}

export function setYear(date: CalendarDate, year: number): CalendarDate {
  return setDate(date, { year })
}

export function setMonth(date: CalendarDate, month: number): CalendarDate {
  return setDate(date, { month })
}

export function setDay(date: CalendarDate, day: number): CalendarDate {
  return setDate(date, { day })
}

export function addDate(date: CalendarDate, duration: CalendarDateDuration): CalendarDate {
  return date.add(toTemporalDuration(duration))
}

export function subtractDate(date: CalendarDate, duration: CalendarDateDuration): CalendarDate {
  return date.subtract(toTemporalDuration(duration))
}

export function startOfDate(date: CalendarDate, unit: CalendarDateUnit): CalendarDate {
  if (unit === 'day') return date
  if (unit === 'week') return date.subtract({ days: date.dayOfWeek % 7 })
  if (unit === 'month') return date.with({ day: 1 })
  if (unit === 'quarter') return date.with({ month: getQuarter(date).quarter * 3 - 2, day: 1 })
  return date.with({ month: 1, day: 1 })
}

export function endOfDate(date: CalendarDate, unit: CalendarDateUnit): CalendarDate {
  return addDate(startOfDate(date, unit), getUnitDuration(unit)).subtract({
    days: 1,
  })
}

export function isBeforeDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) < 0
}

export function isAfterDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) > 0
}

export function isSameOrBeforeDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) <= 0
}

export function isSameOrAfterDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) >= 0
}

export function isBetweenDate(
  date: CalendarDate,
  start: CalendarDate,
  end: CalendarDate,
  inclusive = true,
): boolean {
  if (inclusive) {
    return isSameOrAfterDate(date, start) && isSameOrBeforeDate(date, end)
  }
  return isAfterDate(date, start) && isBeforeDate(date, end)
}

export function minDate(left: CalendarDate, right: CalendarDate): CalendarDate {
  return isBeforeDate(left, right) ? left : right
}

export function maxDate(left: CalendarDate, right: CalendarDate): CalendarDate {
  return isAfterDate(left, right) ? left : right
}

export function clampDate(date: CalendarDate, min?: CalendarDate, max?: CalendarDate): CalendarDate {
  if (min && isBeforeDate(date, min)) return min
  if (max && isAfterDate(date, max)) return max
  return date
}

export function getQuarter(date: CalendarDate): CalendarQuarter {
  return { year: date.year, quarter: (Math.floor((date.month - 1) / 3) + 1) as 1 | 2 | 3 | 4 }
}

export function setQuarter(date: CalendarDate, quarter: CalendarQuarter['quarter']) {
  return date.with({ month: (quarter - 1) * 3 + 1, day: 1 })
}

export function getYear(date: CalendarDate): CalendarYear {
  return { year: date.year }
}

export function getWeekStart(date: CalendarDate, weekStartsOn: CalendarWeekday = 0): CalendarDate {
  const offset = (date.dayOfWeek - weekStartsOn + 7) % 7
  return date.subtract({ days: offset })
}

export function getWeekEnd(date: CalendarDate, weekStartsOn: CalendarWeekday = 0): CalendarDate {
  return getWeekStart(date, weekStartsOn).add({ days: 6 })
}

function toTemporalDuration(duration: CalendarDateDuration) {
  return {
    ...(duration.years ? { years: duration.years } : {}),
    ...(duration.months ? { months: duration.months } : {}),
    ...(duration.weeks ? { weeks: duration.weeks } : {}),
    ...(duration.days ? { days: duration.days } : {}),
  }
}

function getUnitDuration(unit: CalendarDateUnit): CalendarDateDuration {
  if (unit === 'day') return { days: 1 }
  if (unit === 'week') return { weeks: 1 }
  if (unit === 'month') return { months: 1 }
  if (unit === 'quarter') return { months: 3 }
  return { years: 1 }
}

export type DateFormatToken =
  | 'YYYY' | 'YY' | 'MM' | 'M' | 'DD' | 'D'
  | 'HH' | 'H' | 'hh' | 'h' | 'mm' | 'm' | 'ss' | 's' | 'SSS' | 'A' | 'a'

export type DateFormatPart =
  | { type: 'token'; token: DateFormatToken }
  | { type: 'literal'; value: string }

export interface DateTimeFields extends TimeValue {
  year?: number | undefined
  month?: number | undefined
  day?: number | undefined
}

export type DateTimeInput = Date | Partial<DateTimeFields>

export type DateTimeParseResult =
  | { valid: true; value: DateTimeFields }
  | { valid: false; reason: 'incomplete' | 'format-mismatch' | 'out-of-range'; token?: DateFormatToken }

export interface TimeFormatColumn {
  unit: 'hour' | 'minute' | 'second' | 'period'
  token: DateFormatToken
}

export interface TimeFormatAnalysis {
  valid: boolean
  columns: readonly TimeFormatColumn[]
  parts: readonly DateFormatPart[]
  reason?: 'date-token' | 'duplicate-unit' | 'hour-cycle' | 'missing-period' | undefined
}

const DATE_FORMAT_TOKENS: readonly DateFormatToken[] = [
  'YYYY', 'SSS', 'YY', 'MM', 'DD', 'HH', 'hh', 'mm', 'ss', 'M', 'D', 'H', 'h', 'm', 's', 'A', 'a',
]

export function tokenizeDateFormat(pattern: string): readonly DateFormatPart[] {
  const parts: DateFormatPart[] = []
  let index = 0
  while (index < pattern.length) {
    if (pattern[index] === '[') {
      const end = pattern.indexOf(']', index + 1)
      const value = end === -1 ? pattern.slice(index + 1) : pattern.slice(index + 1, end)
      pushLiteral(parts, value)
      index = end === -1 ? pattern.length : end + 1
      continue
    }
    const token = DATE_FORMAT_TOKENS.find(candidate => pattern.startsWith(candidate, index))
    if (token) {
      parts.push({ type: 'token', token })
      index += token.length
      continue
    }
    pushLiteral(parts, pattern[index] ?? '')
    index += 1
  }
  return parts
}

export function format(value: DateTimeInput, pattern: string): string {
  const fields = toDateTimeFields(value)
  return tokenizeDateFormat(pattern).map(part => {
    if (part.type === 'literal') return part.value
    return formatToken(fields, part.token)
  }).join('')
}

export function parse(text: string, pattern: string): DateTimeParseResult {
  const parts = tokenizeDateFormat(pattern)
  const captures: DateFormatToken[] = []
  const source = parts.map(part => {
    if (part.type === 'literal') return escapeRegExp(part.value)
    captures.push(part.token)
    return tokenPattern(part.token)
  }).join('')
  const match = new RegExp(`^${source}$`, 'i').exec(text)
  if (!match) {
    const incomplete = text.length < format({ year: 2000, month: 1, day: 1, hour: 0, minute: 0, second: 0 }, pattern).length
    return { valid: false, reason: incomplete ? 'incomplete' : 'format-mismatch' }
  }

  const fields: DateTimeFields = { hour: 0, minute: 0, second: 0 }
  let period: 'am' | 'pm' | undefined
  let parsed12Hour: number | undefined
  for (let index = 0; index < captures.length; index += 1) {
    const token = captures[index]
    const raw = match[index + 1] ?? ''
    if (!token) continue
    if (token === 'A' || token === 'a') {
      period = raw.toLowerCase() as 'am' | 'pm'
      continue
    }
    const numeric = Number(raw)
    if (token === 'YYYY') fields.year = numeric
    else if (token === 'YY') fields.year = 2000 + numeric
    else if (token === 'M' || token === 'MM') fields.month = numeric
    else if (token === 'D' || token === 'DD') fields.day = numeric
    else if (token === 'H' || token === 'HH') fields.hour = numeric
    else if (token === 'h' || token === 'hh') { fields.hour = numeric; parsed12Hour = numeric }
    else if (token === 'm' || token === 'mm') fields.minute = numeric
    else if (token === 's' || token === 'ss') fields.second = numeric
    else if (token === 'SSS') fields.millisecond = numeric
  }

  const hour12 = captures.some(token => token === 'h' || token === 'hh')
  if (hour12 && (parsed12Hour === undefined || parsed12Hour < 1 || parsed12Hour > 12)) {
    return { valid: false, reason: 'out-of-range', token: 'h' }
  }
  if (hour12 && period) fields.hour = (fields.hour % 12) + (period === 'pm' ? 12 : 0)
  const invalidToken = getInvalidFieldToken(fields, hour12)
  return invalidToken
    ? { valid: false, reason: 'out-of-range', token: invalidToken }
    : { valid: true, value: fields }
}

export function analyzeTimeFormat(pattern: string, use12Hours = false): TimeFormatAnalysis {
  const parts = tokenizeDateFormat(pattern)
  const columns: TimeFormatColumn[] = []
  const seen = new Set<TimeFormatColumn['unit']>()
  for (const part of parts) {
    if (part.type === 'literal') continue
    const unit = getTimeTokenUnit(part.token)
    if (!unit) return { valid: false, columns, parts, reason: 'date-token' }
    if (seen.has(unit)) return { valid: false, columns, parts, reason: 'duplicate-unit' }
    seen.add(unit)
    columns.push({ unit, token: part.token })
  }
  const has12Hour = columns.some(column => column.token === 'h' || column.token === 'hh')
  const has24Hour = columns.some(column => column.token === 'H' || column.token === 'HH')
  if ((use12Hours && has24Hour) || (!use12Hours && (has12Hour || seen.has('period')))) {
    return { valid: false, columns, parts, reason: 'hour-cycle' }
  }
  if (use12Hours && seen.has('hour') && !seen.has('period')) {
    return { valid: false, columns, parts, reason: 'missing-period' }
  }
  return { valid: true, columns, parts }
}

function toDateTimeFields(value: DateTimeInput): DateTimeFields {
  if (value instanceof Date) {
    return {
      year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate(),
      hour: value.getHours(), minute: value.getMinutes(), second: value.getSeconds(),
      millisecond: value.getMilliseconds(),
    }
  }
  return { hour: 0, minute: 0, second: 0, ...value }
}

function formatToken(value: DateTimeFields, token: DateFormatToken): string {
  const hour12 = value.hour % 12 || 12
  const map: Record<DateFormatToken, string> = {
    YYYY: pad(value.year ?? 0, 4), YY: pad((value.year ?? 0) % 100, 2),
    MM: pad(value.month ?? 0, 2), M: String(value.month ?? 0),
    DD: pad(value.day ?? 0, 2), D: String(value.day ?? 0),
    HH: pad(value.hour, 2), H: String(value.hour), hh: pad(hour12, 2), h: String(hour12),
    mm: pad(value.minute, 2), m: String(value.minute), ss: pad(value.second, 2), s: String(value.second),
    SSS: pad(value.millisecond ?? 0, 3), A: value.hour >= 12 ? 'PM' : 'AM', a: value.hour >= 12 ? 'pm' : 'am',
  }
  return map[token]
}

function tokenPattern(token: DateFormatToken): string {
  if (token === 'YYYY') return '(\\d{4})'
  if (token === 'SSS') return '(\\d{1,3})'
  if (token === 'A' || token === 'a') return '(AM|PM)'
  if (token.length === 2) return '(\\d{2})'
  return '(\\d{1,2})'
}

function getInvalidFieldToken(value: DateTimeFields, hour12: boolean): DateFormatToken | undefined {
  if (value.month !== undefined && (value.month < 1 || value.month > 12)) return 'M'
  if (value.day !== undefined && (value.day < 1 || value.day > 31)) return 'D'
  if (hour12 ? value.hour < 0 || value.hour > 23 : value.hour < 0 || value.hour > 23) return hour12 ? 'h' : 'H'
  if (value.minute < 0 || value.minute > 59) return 'm'
  if (value.second < 0 || value.second > 59) return 's'
  if (value.millisecond !== undefined && (value.millisecond < 0 || value.millisecond > 999)) return 'SSS'
  return undefined
}

function getTimeTokenUnit(token: DateFormatToken): TimeFormatColumn['unit'] | undefined {
  if (token === 'H' || token === 'HH' || token === 'h' || token === 'hh') return 'hour'
  if (token === 'm' || token === 'mm') return 'minute'
  if (token === 's' || token === 'ss') return 'second'
  if (token === 'A' || token === 'a') return 'period'
  return undefined
}

function pushLiteral(parts: DateFormatPart[], value: string) {
  const previous = parts.at(-1)
  if (previous?.type === 'literal') previous.value += value
  else parts.push({ type: 'literal', value })
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, '0')
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
