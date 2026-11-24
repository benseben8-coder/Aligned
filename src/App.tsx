import { useState, type CSSProperties } from 'react'
import { calculateCompatibility, type Compatibility, type Person } from './compatibility'
import './App.css'

const starterPeople: [Person, Person] = [
	{ name: '', birthDate: '' },
	{ name: '', birthDate: '' },
]

function App() {
	const [people, setPeople] = useState<[Person, Person]>(starterPeople)
	const [result, setResult] = useState<Compatibility | null>(null)
	const [privacyOpen, setPrivacyOpen] = useState(false)

	const ready = people.every(person => Boolean(person.birthDate))

	function updatePerson(index: 0 | 1, field: keyof Person, value: string) {
		setPeople(current => {
			const next: [Person, Person] = [{ ...current[0] }, { ...current[1] }]
			next[index] = { ...next[index], [field]: value }
			return next
		})
		setResult(null)
	}

	function revealReading() {
		if (!ready) return
		setResult(calculateCompatibility(people[0], people[1]))
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	if (result) {
		return (
			<main className="app-shell reading">
				<nav className="topbar">
					<button className="brand" onClick={() => setResult(null)} aria-label="Start a new reading">
						<span className="brand-mark">A</span>
						<span>ALIGNED</span>
					</button>
					<button className="privacy-link" onClick={() => setPrivacyOpen(true)}>Privacy</button>
				</nav>

				<section className="reading-hero">
					<div className="eyebrow"><span /> Your shared reading <span /></div>
					<div className="match-ring" style={{ '--score': `${result.overall * 3.6}deg` } as CSSProperties}>
						<div><strong>{result.overall}</strong><small>MATCH</small></div>
					</div>
					<h1>{people[0].name.trim() || 'Person one'} <em>&</em> {people[1].name.trim() || 'Person two'}</h1>
					<p className="summary">{result.summary}</p>
				</section>

				<section className="results-grid">
					{[
						{ ...result.western, label: result.western.sign, icon: '☼' },
						{ ...result.chinese, label: result.chinese.animal, icon: '☯' },
						{ ...result.numerology, label: result.numerology.number, icon: '◇' },
					].map((system) => (
						<article className="system-card" key={system.name}>
							<div className="card-top">
								<span className="system-icon">{system.icon}</span>
								<span className="system-score">{system.score}%</span>
							</div>
							<p className="system-name">{system.name}</p>
							<h2>{system.title}</h2>
							<p className="system-label">{system.label}</p>
							<p className="system-text">{system.text}</p>
						</article>
					))}
				</section>

				<section className="prompt-panel">
					<p className="eyebrow plain">A conversation for you both</p>
					<h2>Turn reflection into connection</h2>
					<div className="prompts">
						{result.prompts.map((prompt, index) => (
							<div className="prompt" key={prompt}><span>{String(index + 1).padStart(2, '0')}</span><p>{prompt}</p></div>
						))}
					</div>
				</section>

				<div className="reading-actions">
					<button className="secondary-button" onClick={() => setResult(null)}>Edit details</button>
					<button className="primary-button" onClick={() => window.print()}>Save reading</button>
				</div>
				<p className="disclaimer">For entertainment and reflection only—not a scientific prediction or relationship advice.</p>
				{privacyOpen && <PrivacyModal close={() => setPrivacyOpen(false)} />}
			</main>
		)
	}

	return (
		<main className="app-shell">
			<nav className="topbar">
				<div className="brand"><span className="brand-mark">A</span><span>ALIGNED</span></div>
				<button className="privacy-link" onClick={() => setPrivacyOpen(true)}>Privacy</button>
			</nav>

			<section className="hero-form">
				<div className="intro">
					<p className="eyebrow"><span /> Match reading <span /></p>
					<h1>Two people.<br /><em>One perspective.</em></h1>
					<p>Explore the patterns, contrasts, and conversation beneath your connection.</p>
				</div>

				<div className="people-grid">
					{people.map((person, index) => (
						<section className="person-card" key={index}>
							<div className="person-heading"><span>0{index + 1}</span><h2>{index === 0 ? 'You' : 'Your person'}</h2></div>
							<label>
								<span>Name <small>Optional</small></span>
								<input value={person.name} onChange={event => updatePerson(index as 0 | 1, 'name', event.target.value)} placeholder="Your name" autoComplete="off" />
							</label>
							<label>
								<span>Birth date</span>
								<input type="date" value={person.birthDate} onChange={event => updatePerson(index as 0 | 1, 'birthDate', event.target.value)} max={new Date().toISOString().split('T')[0]} />
							</label>
						</section>
					))}
				</div>

				<button className="reveal-button" disabled={!ready} onClick={revealReading}>
					Reveal your match <span>→</span>
				</button>
				<p className="privacy-note">Birth details stay in this browser. No account or API is required.</p>
			</section>
			{privacyOpen && <PrivacyModal close={() => setPrivacyOpen(false)} />}
		</main>
	)
}

function PrivacyModal({ close }: { close: () => void }) {
	return (
		<div className="modal-backdrop" role="presentation" onMouseDown={close}>
			<section className="modal" role="dialog" aria-modal="true" aria-labelledby="privacy-title" onMouseDown={event => event.stopPropagation()}>
				<button className="modal-close" onClick={close} aria-label="Close privacy details">×</button>
				<p className="eyebrow plain">Your privacy</p>
				<h2 id="privacy-title">Nothing leaves this browser</h2>
				<p>Names and birth dates are optional inputs used only to create your on-screen reading. This MVP does not store, transmit, sell, or share them, and no API keys or accounts are used.</p>
				<button className="primary-button" onClick={close}>Got it</button>
			</section>
		</div>
	)
}

export default App
