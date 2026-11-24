export type Person = { name: string; birthDate: string }

export type Compatibility = {
  overall: number
  western: { name: string; sign: string; score: number; title: string; text: string }
  chinese: { name: string; animal: string; score: number; title: string; text: string }
  numerology: { name: string; number: string; score: number; title: string; text: string }
  summary: string
  prompts: string[]
}

export function zodiacSign(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const ranges: Array<[number, number, string, string]> = [
    [1, 19, 'Capricorn', 'Aquarius'], [2, 18, 'Aquarius', 'Pisces'],
    [3, 20, 'Pisces', 'Aries'], [4, 19, 'Aries', 'Taurus'],
    [5, 20, 'Taurus', 'Gemini'], [6, 20, 'Gemini', 'Cancer'],
    [7, 22, 'Cancer', 'Leo'], [8, 22, 'Leo', 'Virgo'],
    [9, 22, 'Virgo', 'Libra'], [10, 22, 'Libra', 'Scorpio'],
    [11, 21, 'Scorpio', 'Sagittarius'], [12, 21, 'Sagittarius', 'Capricorn'],
  ]
  const [, boundary, before, after] = ranges.find(([rangeMonth]) => rangeMonth === month)!
  return day <= boundary ? before : after
}

export function chineseAnimal(dateString: string) {
  const animals = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig']
  const year = new Date(`${dateString}T12:00:00`).getFullYear()
  return animals[((year - 4) % 12 + 12) % 12]
}

export function lifePathNumber(dateString: string) {
  let total = [...dateString.replace(/[^0-9]/g,'')].reduce((sum,digit) => sum + Number(digit),0)
  while (total > 9 && ![11,22,33].includes(total)) total = [...String(total)].reduce((sum,digit) => sum + Number(digit),0)
  return total
}

const signElements: Record<string,string> = {
  Aries:'Fire',Leo:'Fire',Sagittarius:'Fire', Taurus:'Earth',Virgo:'Earth',Capricorn:'Earth',
  Gemini:'Air',Libra:'Air',Aquarius:'Air', Cancer:'Water',Scorpio:'Water',Pisces:'Water',
}

function zodiacScore(a:string,b:string) {
  if (a === b) return 86
  const ea=signElements[a], eb=signElements[b]
  if (ea===eb) return 82
  if ((ea==='Fire'&&eb==='Air')||(ea==='Air'&&eb==='Fire')||(ea==='Earth'&&eb==='Water')||(ea==='Water'&&eb==='Earth')) return 91
  if ((ea==='Fire'&&eb==='Water')||(ea==='Water'&&eb==='Fire')||(ea==='Earth'&&eb==='Air')||(ea==='Air'&&eb==='Earth')) return 68
  return 76
}

function chineseScore(a:string,b:string) {
  if (a===b) return 84
  const harmonious=[['Rat','Dragon','Monkey'],['Ox','Snake','Rooster'],['Tiger','Horse','Dog'],['Rabbit','Goat','Pig']]
  const opposing=[['Rat','Horse'],['Ox','Goat'],['Tiger','Monkey'],['Rabbit','Rooster'],['Dragon','Dog'],['Snake','Pig']]
  if (harmonious.some(g=>g.includes(a)&&g.includes(b))) return 89
  if (opposing.some(p=>p.includes(a)&&p.includes(b))) return 69
  return 78
}

function numerologyScore(a:number,b:number) {
  if (a===b) return 88
  const pair=[a,b].sort((x,y)=>x-y).join('-')
  if (['1-7','2-6','3-5','2-8','3-9','4-8','6-9'].includes(pair)) return 90
  if (['1-8','1-9','3-8','5-8'].includes(pair)) return 70
  return 80
}

export function calculateCompatibility(a:Person,b:Person):Compatibility {
  const westernA=zodiacSign(a.birthDate), westernB=zodiacSign(b.birthDate)
  const chineseA=chineseAnimal(a.birthDate), chineseB=chineseAnimal(b.birthDate)
  const numberA=lifePathNumber(a.birthDate), numberB=lifePathNumber(b.birthDate)
  const western=zodiacScore(westernA,westernB), chinese=chineseScore(chineseA,chineseB), numerology=numerologyScore(numberA,numberB)
  const overall=Math.round(western*.4+chinese*.35+numerology*.25)
  const sameEnergy=western>=84&&chinese>=84

  return {
    overall,
    western:{name:'Western astrology',sign:`${westernA} × ${westernB}`,score:western,title:western>=85?'Natural rhythm':'Complementary rhythm',text:western>=85?'Your signs resonate through a shared emotional style. You may understand each other quickly and feel at ease without overexplaining.':'Your signs approach connection differently. The blend offers growth: one of you may bring steadiness while the other opens new possibilities.'},
    chinese:{name:'Chinese astrology',animal:`${chineseA} × ${chineseB}`,score:chinese,title:chinese>=84?'A strong instinctive bond':'A bridge-building pairing',text:chinese>=84?'Your zodiac animals share compatible instincts around trust, effort, and momentum. Small gestures may carry real weight.':'Your animals bring different instincts to the relationship. Naming the gap can turn it from friction into a useful rhythm.'},
    numerology:{name:'Numerology',number:`${numberA} × ${numberB}`,score:numerology,title:numerology>=86?'Aligned life themes':'Distinct motivations',text:numerology>=86?'Your life-path numbers echo one another. Shared values may make it easier to agree on pace, purpose, and what commitment feels like.':'Your numbers suggest different sources of motivation. Make room for each person’s pace, private goals, and way of feeling appreciated.'},
    summary:sameEnergy?'You share an easy sense of recognition. Your chart patterns point toward instinctive chemistry, while your differences leave enough texture to keep the connection growing.':'There is a meaningful pull between familiarity and contrast. This pairing seems especially suited to conversations that turn differences into curiosity rather than conflict.',
    prompts:['What makes you feel chosen by someone, rather than simply accompanied?','Where do we naturally move at the same pace—and where should we slow down?','What kind of reassurance helps you stay open during uncertainty?','What should we protect as a couple as our lives keep changing?'],
  }
}
