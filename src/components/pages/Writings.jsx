import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, ArrowUpRight, Calendar, Clock } from 'lucide-react';

const ARTICLES = [
  {
    title: 'From Hashes to Maps: Consistent Hashing as a Lesson in Go Internals',
    desc: 'A practical walkthrough of consistent hashing, hash rings, and why ordered lookup matters in Go systems.',
    tags: ['Go', 'Distributed Systems', 'System Design', 'Backend'],
    stacks: ['go', 'distributed systems', 'system design', 'backend'],
    date: 'February 1, 2026',
    read: '13 min read',
  },
  {
    title: 'Building Resilient Microservices with Circuit Breakers in Node.js',
    desc: 'How to implement the circuit breaker pattern in production Node.js services to prevent cascading failures.',
    tags: ['Node.js', 'Backend', 'Architecture'],
    stacks: ['node.js', 'backend', 'architecture'],
    date: 'January 18, 2026',
    read: '9 min read',
  },
  {
    title: 'Zero-Downtime Deployments with Blue-Green Strategy',
    desc: 'A step-by-step guide to implementing blue-green deployments for zero-downtime production releases.',
    tags: ['Architecture', 'Backend', 'APIs'],
    stacks: ['architecture', 'backend', 'apis'],
    date: 'December 5, 2025',
    read: '7 min read',
  },
];

const FILTERS = ['all','apis','architecture','backend','distributed systems','go','node.js','realtime','system design','typescript'];

export default function Writings() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery]   = useState('');

  const visible = ARTICLES.filter(a => {
    const matchesFilter = filter === 'all' || a.stacks.includes(filter);
    const matchesQuery  = !query || a.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const container = useRef();

  useGSAP(() => {
    if (visible.length > 0) {
      gsap.from('.article-card', {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
  }, { dependencies: [visible], scope: container });

  return (
    <div className="writings-page" ref={container}>
      <div className="page-header">
        <h1 className="writings-hero-heading">
          <span className="solid">LATEST</span>
          <span className="ghost">WRITINGS</span>
        </h1>
        <p className="page-subtitle">Notes on systems, backend engineering, and implementation lessons from real builds.</p>
      </div>

      <div className="search-bar">
        <Search size={17} color="var(--text-muted)" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search title, tags, or topics"
        />
      </div>

      <div className="filter-chips">
        {FILTERS.map(f => (
          <button key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="articles-list">
        {visible.map((a, i) => (
          <div className="article-card" key={i}>
            <div className="article-top">
              <h3>{a.title}</h3>
              <ArrowUpRight size={17} className="card-arrow" />
            </div>
            <p>{a.desc}</p>
            <div className="article-tags">
              {a.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div className="article-meta">
              <span><Calendar size={13} /> {a.date}</span>
              <span><Clock size={13} /> {a.read}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
