import { describe, expect, it } from 'vitest'
import { chineseAnimal, lifePathNumber, zodiacSign, calculateCompatibility } from './compatibility'

describe('birth detail calculations', () => {
  it('returns the correct western zodiac sign at boundaries', () => {
    expect(zodiacSign('1994-03-21')).toBe('Aries')
    expect(zodiacSign('1994-04-19')).toBe('Aries')
    expect(zodiacSign('1994-04-20')).toBe('Taurus')
  })
  it('maps birth years to Chinese zodiac animals', () => {
    expect(chineseAnimal('2024-06-01')).toBe('Dragon')
    expect(chineseAnimal('1996-06-01')).toBe('Rat')
  })
  it('reduces a life path number to a single digit', () => {
    expect(lifePathNumber('1996-05-18')).toBe(3)
  })
  it('preserves a master life path number', () => {
    expect(lifePathNumber('1900-08-29')).toBe(11)
  })
})

describe('compatibility reading', () => {
  it('produces a score and all three system explanations', () => {
    const result = calculateCompatibility({name:'Ari',birthDate:'1994-03-21'}, {name:'Sam',birthDate:'1996-07-22'})
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(result.overall).toBeLessThanOrEqual(100)
    expect(result.western.sign).toContain('×')
    expect(result.chinese.animal).toContain('×')
    expect(result.numerology.number).toContain('×')
    expect(result.prompts).toHaveLength(4)
  })
  it('is deterministic for the same pair', () => {
    const a={name:'Maya',birthDate:'1991-01-15'}, b={name:'Theo',birthDate:'1988-08-03'}
    expect(calculateCompatibility(a,b)).toEqual(calculateCompatibility(a,b))
  })
})
