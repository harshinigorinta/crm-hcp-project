import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading, setSuccessMessage, setError, clearMessages } from '../store/interactionSlice';

const API = 'http://127.0.0.1:8000';

export default function LogInteractionPage() {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector(state => state.interactions);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [form, setForm] = useState({
    hcp_name: '',
    hcp_specialty: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0,5),
    interaction_type: 'Meeting',
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: 'Neutral',
    outcomes: '',
    follow_up_actions: '',
    notes: '',
    product_discussed: '',
    location: '',
  });

  const handleFormSubmit = async () => {
    dispatch(setLoading(true));
    dispatch(clearMessages());
    try {
      await axios.post(`${API}/api/log-form`, {
        hcp_name: form.hcp_name,
        hcp_specialty: form.hcp_specialty,
        date: form.date,
        location: form.location,
        product_discussed: form.product_discussed,
        notes: `Topics: ${form.topics_discussed}. Materials: ${form.materials_shared}. Samples: ${form.samples_distributed}. Outcomes: ${form.outcomes}. Follow-up: ${form.follow_up_actions}. Sentiment: ${form.sentiment}`,
      });
      dispatch(setSuccessMessage('✅ Interaction logged successfully!'));
    } catch (err) {
      dispatch(setError('❌ Something went wrong. Please try again.'));
    }
    dispatch(setLoading(false));
  };

  const handleChatSend = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = { role: 'user', text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setChatLoading(true);
    try {
      const res = await axios.post(`${API}/api/log-chat`, { message: chatMessage });
      const data = res.data.data;
      const aiText = `✅ Logged! Here's what I captured:\n👤 HCP: ${data.hcp_name || 'N/A'}\n🏥 Specialty: ${data.hcp_specialty || 'N/A'}\n📅 Date: ${data.date || 'N/A'}\n📍 Location: ${data.location || 'N/A'}\n💊 Product: ${data.product_discussed || 'N/A'}\n📝 Notes: ${data.notes || 'N/A'}\n💬 Sentiment: ${data.sentiment || 'N/A'}\n📆 Follow-up: ${data.follow_up_date || 'N/A'}`;
      setChatHistory(prev => [...prev, { role: 'ai', text: aiText }]);
      // Auto fill form with AI extracted data
      setForm(prev => ({
        ...prev,
        hcp_name: data.hcp_name || prev.hcp_name,
        hcp_specialty: data.hcp_specialty || prev.hcp_specialty,
        date: data.date || prev.date,
        location: data.location || prev.location,
        product_discussed: data.product_discussed || prev.product_discussed,
        notes: data.notes || prev.notes,
        sentiment: data.sentiment || prev.sentiment,
        follow_up_actions: data.follow_up_date || prev.follow_up_actions,
      }));
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: '❌ Error processing. Please try again.' }]);
    }
    setChatLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* LEFT PANEL - Form */}
      <div style={styles.leftPanel}>
        <h2 style={styles.sectionTitle}>Interaction Details</h2>

        {successMessage && <div style={styles.success}>{successMessage}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Row 1 */}
        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>HCP Name</label>
            <input style={styles.input} placeholder="Search or select HCP..."
              value={form.hcp_name} onChange={e => setForm({...form, hcp_name: e.target.value})} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Interaction Type</label>
            <select style={styles.input} value={form.interaction_type}
              onChange={e => setForm({...form, interaction_type: e.target.value})}>
              <option>Meeting</option>
              <option>Call</option>
              <option>Email</option>
              <option>Conference</option>
              <option>Virtual Meeting</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Date</label>
            <input style={styles.input} type="date" value={form.date}
              onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Time</label>
            <input style={styles.input} type="time" value={form.time}
              onChange={e => setForm({...form, time: e.target.value})} />
          </div>
        </div>

        {/* Specialty & Location */}
        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Specialty</label>
            <input style={styles.input} placeholder="e.g. Cardiologist"
              value={form.hcp_specialty} onChange={e => setForm({...form, hcp_specialty: e.target.value})} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Location</label>
            <input style={styles.input} placeholder="e.g. City Hospital"
              value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
        </div>

        {/* Attendees */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Attendees</label>
          <input style={styles.input} placeholder="Enter names or search..."
            value={form.attendees} onChange={e => setForm({...form, attendees: e.target.value})} />
        </div>

        {/* Topics Discussed */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Topics Discussed</label>
          <textarea style={styles.textarea} placeholder="Enter key discussion points..."
            value={form.topics_discussed} onChange={e => setForm({...form, topics_discussed: e.target.value})} />
        </div>

        {/* Product */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Product Discussed</label>
          <input style={styles.input} placeholder="e.g. CardioMax 10mg"
            value={form.product_discussed} onChange={e => setForm({...form, product_discussed: e.target.value})} />
        </div>

        {/* Materials */}
        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Materials Shared</label>
            <input style={styles.input} placeholder="e.g. Brochure, PDF"
              value={form.materials_shared} onChange={e => setForm({...form, materials_shared: e.target.value})} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Samples Distributed</label>
            <input style={styles.input} placeholder="e.g. 5 samples of CardioMax"
              value={form.samples_distributed} onChange={e => setForm({...form, samples_distributed: e.target.value})} />
          </div>
        </div>

        {/* Sentiment */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Observed/Inferred HCP Sentiment</label>
          <div style={styles.sentimentRow}>
            {['Positive', 'Neutral', 'Negative'].map(s => (
              <label key={s} style={styles.radioLabel}>
                <input type="radio" name="sentiment" value={s}
                  checked={form.sentiment === s}
                  onChange={() => setForm({...form, sentiment: s})} />
                <span style={{
                  color: s === 'Positive' ? '#065f46' : s === 'Negative' ? '#991b1b' : '#92400e',
                  fontWeight: 600, marginLeft: 4
                }}>{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Outcomes</label>
          <textarea style={styles.textarea} placeholder="Key outcomes or agreements..."
            value={form.outcomes} onChange={e => setForm({...form, outcomes: e.target.value})} />
        </div>

        {/* Follow-up */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Follow-up Actions</label>
          <textarea style={styles.textarea} placeholder="Enter next steps or tasks..."
            value={form.follow_up_actions} onChange={e => setForm({...form, follow_up_actions: e.target.value})} />
        </div>

        {/* Submit */}
        <button style={styles.submitBtn} onClick={handleFormSubmit} disabled={loading}>
          {loading ? '⏳ Saving...' : '💾 Log Interaction'}
        </button>
      </div>

      {/* RIGHT PANEL - AI Chat */}
      <div style={styles.rightPanel}>
        <div style={styles.aiHeader}>
          <span style={styles.aiIcon}>🤖</span>
          <div>
            <div style={styles.aiTitle}>AI Assistant</div>
            <div style={styles.aiSubtitle}>Log interaction via chat</div>
          </div>
        </div>

        {/* Chat History */}
        <div style={styles.chatHistory}>
          {chatHistory.length === 0 && (
            <div style={styles.chatPlaceholder}>
              Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
              <pre style={styles.msgText}>{msg.text}</pre>
            </div>
          ))}
          {chatLoading && (
            <div style={styles.aiMsg}>
              <p style={styles.msgText}>⏳ AI is thinking...</p>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div style={styles.chatInputRow}>
          <input
            style={styles.chatInput}
            placeholder="Describe interaction..."
            value={chatMessage}
            onChange={e => setChatMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleChatSend()}
          />
          <button style={styles.logBtn} onClick={handleChatSend} disabled={chatLoading}>
            {chatLoading ? '...' : '⚡ Log'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', gap: 24, maxWidth: 1200, margin: '24px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif', alignItems: 'flex-start' },
  leftPanel: { flex: 2, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  rightPanel: { flex: 1, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', minHeight: 500 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 20 },
  row: { display: 'flex', gap: 16, marginBottom: 16 },
  fieldGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
  fieldFull: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: { padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none' },
  textarea: { padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'Inter, sans-serif', minHeight: 80, resize: 'vertical' },
  sentimentRow: { display: 'flex', gap: 24, padding: '10px 0' },
  radioLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 14 },
  submitBtn: { width: '100%', padding: '14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 16, marginTop: 8 },
  success: { background: '#d1fae5', color: '#065f46', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 },
  error: { background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 },
  aiHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' },
  aiIcon: { fontSize: 28 },
  aiTitle: { fontWeight: 700, fontSize: 15, color: '#1a1a2e' },
  aiSubtitle: { fontSize: 12, color: '#6b7280' },
  chatHistory: { flex: 1, overflowY: 'auto', marginBottom: 16, minHeight: 300, maxHeight: 400 },
  chatPlaceholder: { color: '#9ca3af', fontSize: 13, lineHeight: 1.6, padding: 12, background: '#f9fafb', borderRadius: 8 },
  userMsg: { background: '#eff6ff', padding: '10px 14px', borderRadius: 8, marginBottom: 10, alignSelf: 'flex-end' },
  aiMsg: { background: '#f9fafb', padding: '10px 14px', borderRadius: 8, marginBottom: 10, border: '1px solid #e5e7eb' },
  msgText: { fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontFamily: 'Inter, sans-serif' },
  chatInputRow: { display: 'flex', gap: 8, marginTop: 'auto' },
  chatInput: { flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'Inter, sans-serif' },
  logBtn: { padding: '10px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 },
};