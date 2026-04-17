import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setInteractions, setLoading } from '../store/interactionSlice';

const API = 'http://127.0.0.1:8000';

export default function InteractionsPage() {
  const dispatch = useDispatch();
  const { interactions, loading } = useSelector(state => state.interactions);

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${API}/api/interactions`);
      dispatch(setInteractions(res.data));
    } catch (err) {
      console.error(err);
    }
    dispatch(setLoading(false));
  };

  const sentimentColor = (sentiment) => {
    if (!sentiment) return '#6b7280';
    if (sentiment.toLowerCase().includes('positive')) return '#065f46';
    if (sentiment.toLowerCase().includes('negative')) return '#991b1b';
    return '#92400e';
  };

  const sentimentBg = (sentiment) => {
    if (!sentiment) return '#f3f4f6';
    if (sentiment.toLowerCase().includes('positive')) return '#d1fae5';
    if (sentiment.toLowerCase().includes('negative')) return '#fee2e2';
    return '#fef3c7';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 All Interactions</h1>
        <button style={styles.refreshBtn} onClick={fetchInteractions}>
          🔄 Refresh
        </button>
      </div>

      {loading && <p style={styles.loading}>⏳ Loading interactions...</p>}

      {!loading && interactions.length === 0 && (
        <div style={styles.empty}>
          <p>No interactions logged yet!</p>
          <p>Go to <b>Log Interaction</b> to add one.</p>
        </div>
      )}

      <div style={styles.grid}>
        {interactions.map((interaction) => (
          <div key={interaction.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.hcpName}>👨‍⚕️ {interaction.hcp_name}</h3>
              <span style={{
                ...styles.sentiment,
                color: sentimentColor(interaction.sentiment),
                background: sentimentBg(interaction.sentiment)
              }}>
                {interaction.sentiment || 'neutral'}
              </span>
            </div>

            <p style={styles.specialty}>🏥 {interaction.hcp_specialty}</p>

            <div style={styles.details}>
              <p><b>📅 Date:</b> {interaction.date}</p>
              <p><b>📍 Location:</b> {interaction.location}</p>
              <p><b>💊 Product:</b> {interaction.product_discussed}</p>
            </div>

            {interaction.notes && (
              <div style={styles.notes}>
                <b>📝 Notes:</b>
                <p>{interaction.notes}</p>
              </div>
            )}

            {interaction.summary && (
              <div style={styles.summary}>
                <b>🤖 AI Summary:</b>
                <p>{interaction.summary}</p>
              </div>
            )}

            {interaction.follow_up_date && (
              <p style={styles.followup}>
                📆 Follow-up: {interaction.follow_up_date}
              </p>
            )}

            <p style={styles.idBadge}>ID: #{interaction.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '40px auto', padding: 24, fontFamily: 'Inter, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  refreshBtn: { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  loading: { textAlign: 'center', color: '#6b7280', fontSize: 18 },
  empty: { textAlign: 'center', color: '#6b7280', background: '#f9fafb', padding: 40, borderRadius: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  hcpName: { fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  specialty: { color: '#6b7280', marginBottom: 12, marginTop: 4 },
  sentiment: { padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  details: { background: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 12 },
  notes: { marginBottom: 12, color: '#374151' },
  summary: { background: '#eff6ff', padding: 12, borderRadius: 8, marginBottom: 12, color: '#1e40af' },
  followup: { color: '#065f46', background: '#d1fae5', padding: '6px 12px', borderRadius: 8, fontSize: 14 },
  idBadge: { color: '#9ca3af', fontSize: 12, marginTop: 12, textAlign: 'right' },
};