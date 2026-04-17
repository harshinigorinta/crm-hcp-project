import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('summarize');
  const [input, setInput] = useState('');
  const [interactionId, setInteractionId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (activeTab === 'summarize') {
        res = await axios.post(`${API}/api/schedule-followup`, { message: input });
        setResult(res.data.result);
      } else if (activeTab === 'hcp_info') {
        res = await axios.post(`${API}/api/hcp-info`, { hcp_name: input });
        setResult(res.data.result);
      } else if (activeTab === 'schedule_followup') {
        res = await axios.post(`${API}/api/schedule-followup`, { message: input });
        setResult(res.data.result);
      } else if (activeTab === 'edit') {
        res = await axios.put(`${API}/api/edit-interaction/${interactionId}`, { message: input });
        setResult(JSON.stringify(res.data.data, null, 2));
      }
    } catch (err) {
      setResult('❌ Error: ' + (err.response?.data?.detail || err.message));
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'summarize', label: '📝 Summarize', desc: 'Paste any interaction note and AI will summarize it.' },
    { id: 'hcp_info', label: '👨‍⚕️ HCP Info', desc: 'Enter a doctor name and AI will give their profile.' },
    { id: 'schedule_followup', label: '📅 Follow-up', desc: 'AI suggests the best follow-up action.' },
    { id: 'edit', label: '✏️ Edit Interaction', desc: 'Edit an existing interaction using natural language.' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🤖 AI Tools</h1>
      <p style={styles.subtitle}>Powered by LangGraph + Groq (gemma2-9b-it)</p>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={activeTab === tab.id ? styles.activeTab : styles.inactiveTab}
            onClick={() => { setActiveTab(tab.id); setResult(null); setInput(''); }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <p style={styles.desc}>
        {tabs.find(t => t.id === activeTab)?.desc}
      </p>

      {/* Edit needs interaction ID */}
      {activeTab === 'edit' && (
        <input
          style={styles.input}
          placeholder="Enter Interaction ID (e.g. 1)"
          value={interactionId}
          onChange={e => setInteractionId(e.target.value)}
        />
      )}

      {/* Input */}
      <textarea
        style={styles.textarea}
        placeholder={
          activeTab === 'hcp_info' ? 'Enter doctor name e.g. Dr. Sharma' :
          activeTab === 'edit' ? 'What do you want to change? e.g. Change location to Mumbai' :
          'Type your interaction note here...'
        }
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={5}
      />

      <button style={styles.btn} onClick={handleRun} disabled={loading}>
        {loading ? '⏳ AI is thinking...' : '▶ Run Tool'}
      </button>

      {/* Result */}
      {result && (
        <div style={styles.result}>
          <h3 style={{ marginTop: 0 }}>🧠 AI Result:</h3>
          <pre style={styles.pre}>{result}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '40px auto', padding: 24, fontFamily: 'Inter, sans-serif' },
  title: { fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 },
  subtitle: { color: '#6b7280', marginBottom: 24 },
  tabs: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 },
  activeTab: { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  inactiveTab: { padding: '10px 20px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  desc: { color: '#374151', background: '#f0f9ff', padding: 12, borderRadius: 8, marginBottom: 16 },
  input: { width: '100%', padding: 12, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, marginBottom: 12, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' },
  textarea: { width: '100%', padding: 12, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' },
  btn: { marginTop: 12, padding: '12px 24px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 16 },
  result: { marginTop: 20, background: '#f9fafb', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' },
  pre: { whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 14, color: '#1f2937' },
};