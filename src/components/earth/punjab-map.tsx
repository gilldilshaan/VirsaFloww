import { useState } from 'react';
import { punjabDistricts, punjabViewBox } from '@/lib/earth/punjab-districts';

const places = [
  { id: 'faridkot', name: 'Faridkot', pa: 'ਫ਼ਰੀਦਕੋਟ', tag: 'WHERE WE GREW UP', x: 149.7, y: 345.6, district: 'Faridkot',
    story: 'Our roots are in Faridkot, in the Malwa belt. Here the year follows paddy and wheat: canal water on the fields in summer, straw decisions after harvest, and long talks at the mandi about prices and credit. We grew up seeing how much work farmers do that never gets written down. VirsaFlow started with that question: how do we make good practices on the field visible and trusted?' },
  { id: 'mohali', name: 'Mohali (SAS Nagar)', pa: 'ਮੋਹਾਲੀ', tag: 'WHERE WE BUILD NOW', x: 455.9, y: 340.6, district: 'Rupnagar',
    story: 'Today we work from Mohali, close to Chandigarh’s universities, research institutes and start-up community. This is where field notes from home become software: evidence records, maps and review workflows. We still go back to the villages often, because the platform only works if it works for the farmer first.' },
] as const;
type PlaceId = (typeof places)[number]['id'];

export function PunjabMap() {
  const [active, setActive] = useState<PlaceId>('faridkot');
  const place = places.find(p => p.id === active)!;
  return <section className="earth-section earth-container punjab-map-section">
    <div className="earth-section-heading"><div><span className="earth-label">FOUNDERS’ MAP · ਪੰਜਾਬ</span><h2>From Faridkot <em>to Mohali.</em></h2></div><p>Tap a district on the map to read the story behind it.</p></div>
    <div className="punjab-map-grid">
      <svg viewBox={punjabViewBox} className="punjab-map" role="group" aria-label="Map of Punjab districts with the founders’ home places">
        {punjabDistricts.map(d => <path key={d.name} d={d.d} className={`pm-district ${d.name === place.district ? 'is-home' : ''}`}><title>{d.name}</title></path>)}
        <path d={`M${places[0].x} ${places[0].y} Q 300 250 ${places[1].x} ${places[1].y}`} className="pm-route"/>
        {places.map(p => <g key={p.id} className={`pm-pin ${active === p.id ? 'is-active' : ''}`} transform={`translate(${p.x} ${p.y})`} tabIndex={0} role="button" aria-pressed={active === p.id} aria-label={p.name} onClick={() => setActive(p.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(p.id); } }}>
          <circle r="22" className="pm-pulse"/><circle r="9" className="pm-dot"/>
          <text y="-20" textAnchor="middle" className="pm-label">{p.name.split(' ')[0]}</text>
        </g>)}
      </svg>
      <article className="punjab-story" key={place.id}>
        <span className="earth-label">{place.tag}</span>
        <h3>{place.name} <span lang="pa">{place.pa}</span></h3>
        <p>{place.story}</p>
        <div className="punjab-tabs">{places.map(p => <button key={p.id} type="button" className={active === p.id ? 'is-active' : ''} onClick={() => setActive(p.id)}>{p.name.split(' ')[0]}</button>)}</div>
      </article>
    </div>
  </section>;
}
