import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Role = 'ADMIN' | 'AM';
type RateStatus = 'OPEN' | 'STOP_SELL';
type RateSource = 'ORIGINAL' | 'MANUAL' | 'EVENT_STOP_SELL';

interface RateRow {
  id: number;
  date: string;
  roomType: string;
  finalRate: number;
  originalRate: number;
  status: RateStatus;
  source: RateSource;
}

interface EventItem {
  id: number;
  name: string;
  eventDate: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  venue: string;
}

interface AuditLog {
  id: number;
  action: string;
  detail: string;
  at: string;
}

const INITIAL_RATES: RateRow[] = [
  { id: 1, date: '2025-03-15', roomType: 'Standard', originalRate: 3600, finalRate: 3600, status: 'OPEN', source: 'ORIGINAL' },
  { id: 2, date: '2025-03-15', roomType: 'Deluxe', originalRate: 5200, finalRate: 5200, status: 'OPEN', source: 'ORIGINAL' },
  { id: 3, date: '2025-03-16', roomType: 'Standard', originalRate: 3700, finalRate: 3700, status: 'OPEN', source: 'ORIGINAL' },
  { id: 4, date: '2025-03-17', roomType: 'Suite', originalRate: 7500, finalRate: 7500, status: 'OPEN', source: 'ORIGINAL' },
];

const INITIAL_EVENTS: EventItem[] = [
  { id: 1, name: '五月天 2025 巡迴演唱會', eventDate: '2025-03-15', impactLevel: 'HIGH', venue: '台北小巨蛋' },
  { id: 2, name: '台北旅展', eventDate: '2025-03-16', impactLevel: 'MEDIUM', venue: '南港展覽館' },
];

function sourceLabel(source: RateSource) {
  if (source === 'EVENT_STOP_SELL') return '事件關房';
  if (source === 'MANUAL') return '人工調整';
  return '原始房價';
}

function App() {
  const [username, setUsername] = useState('am1');
  const [password, setPassword] = useState('Am123456');
  const [totp, setTotp] = useState('000000');
  const [token, setToken] = useState<string>('');
  const [role, setRole] = useState<Role>('AM');

  const [rates, setRates] = useState<RateRow[]>(INITIAL_RATES);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [selectedDate, setSelectedDate] = useState('2025-03-15');
  const [selectedRoomType, setSelectedRoomType] = useState('Standard');
  const [manualRate, setManualRate] = useState(3999);
  const [manualStatus, setManualStatus] = useState<RateStatus>('OPEN');
  const [syncMessage, setSyncMessage] = useState('');
  const [newEventName, setNewEventName] = useState('告五人演唱會');
  const [newEventDate, setNewEventDate] = useState('2025-03-17');
  const [newEventImpact, setNewEventImpact] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  const visibleRates = useMemo(() => rates.sort((a, b) => (a.date > b.date ? 1 : -1)), [rates]);

  const addAudit = (action: string, detail: string) => {
    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        action,
        detail,
        at: new Date().toLocaleString('zh-TW'),
      },
      ...prev,
    ]);
  };

  const handleLogin = () => {
    if (!username || !password || totp.length < 6) {
      alert('請輸入帳密與 6 碼 TOTP');
      return;
    }
    setRole(username === 'admin' ? 'ADMIN' : 'AM');
    setToken(`demo-jwt-${Date.now()}`);
    addAudit('LOGIN', `使用者 ${username} 成功登入 (Demo)`);
  };

  const applyEventStopSell = (event: EventItem) => {
    if (event.impactLevel !== 'HIGH') {
      addAudit('EVENT_RECEIVED', `${event.name} (${event.impactLevel}) 僅記錄，不觸發關房`);
      return;
    }

    let affected = 0;
    setRates((prev) =>
      prev.map((r) => {
        if (r.date === event.eventDate && r.status !== 'STOP_SELL') {
          affected += 1;
          return { ...r, status: 'STOP_SELL', source: 'EVENT_STOP_SELL' };
        }
        return r;
      }),
    );
    addAudit('AUTO_STOP_SELL', `${event.name} 觸發關房，影響 ${affected} 筆`);
  };

  const addEvent = () => {
    const event: EventItem = {
      id: events.length + 1,
      name: newEventName,
      eventDate: newEventDate,
      impactLevel: newEventImpact,
      venue: '未指定場館',
    };
    setEvents((prev) => [event, ...prev]);
    applyEventStopSell(event);
  };

  const manualOverride = () => {
    let updated = false;
    setRates((prev) =>
      prev.map((r) => {
        if (r.date === selectedDate && r.roomType === selectedRoomType) {
          updated = true;
          return { ...r, finalRate: manualRate, status: manualStatus, source: 'MANUAL' };
        }
        return r;
      }),
    );

    if (!updated) {
      alert('找不到對應日期與房型');
      return;
    }
    addAudit('MANUAL_OVERRIDE', `${selectedDate} ${selectedRoomType} 調整為 ${manualRate} / ${manualStatus}`);
  };

  const syncToPms = async () => {
    setSyncMessage('同步中...');
    await new Promise((resolve) => setTimeout(resolve, 700));
    const ok = Math.random() > 0.2;
    if (ok) {
      setSyncMessage('同步成功：已將最終房價與房況寫回 PMS');
      addAudit('SYNC_PMS', '批次同步成功');
    } else {
      setSyncMessage('同步失敗：PMS_TIMEOUT (可重試)');
      addAudit('SYNC_PMS_FAIL', '同步失敗：PMS_TIMEOUT');
    }
  };

  const resetDemoData = () => {
    setRates(INITIAL_RATES);
    setEvents(INITIAL_EVENTS);
    setAuditLogs([]);
    setSyncMessage('');
    addAudit('RESET', '重置為初始資料');
  };

  return (
    <main className="container">
      <header className="card">
        <h1>敦謙 RMS MVP 互動 Demo</h1>
        <p>可試玩：登入、事件觸發關房、手動調整、PMS 同步、稽核軌跡</p>
      </header>

      <section className="grid two-col">
        <div className="card">
          <h2>1) 登入 (FR-01)</h2>
          <label>帳號</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>密碼</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label>TOTP</label>
          <input value={totp} onChange={(e) => setTotp(e.target.value)} />
          <div className="row">
            <button onClick={handleLogin}>登入取得 JWT</button>
            <span className="pill">角色：{role}</span>
          </div>
          <small className="muted">Token: {token ? `${token.slice(0, 18)}...` : '尚未登入'}</small>
        </div>

        <div className="card">
          <h2>2) 外部事件 (FR-06~09)</h2>
          <label>事件名稱</label>
          <input value={newEventName} onChange={(e) => setNewEventName(e.target.value)} />
          <label>事件日期</label>
          <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} />
          <label>影響力</label>
          <select value={newEventImpact} onChange={(e) => setNewEventImpact(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
          <button className="warning" onClick={addEvent}>新增事件並套用規則</button>
        </div>
      </section>

      <section className="card">
        <h2>3) 演算結果列表 (FR-13)</h2>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>房型</th>
              <th>原始售價</th>
              <th>最終售價</th>
              <th>狀態</th>
              <th>來源</th>
            </tr>
          </thead>
          <tbody>
            {visibleRates.map((row) => (
              <tr key={row.id}>
                <td>{row.date}</td>
                <td>{row.roomType}</td>
                <td>{row.originalRate}</td>
                <td>{row.finalRate}</td>
                <td>
                  <span className={row.status === 'STOP_SELL' ? 'chip danger' : 'chip success'}>{row.status}</span>
                </td>
                <td>
                  <span className="chip">{sourceLabel(row.source)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid two-col">
        <div className="card">
          <h2>4) 手動調整 (FR-14)</h2>
          <label>日期</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <label>房型</label>
          <input value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)} />
          <label>最終售價</label>
          <input type="number" value={manualRate} onChange={(e) => setManualRate(Number(e.target.value))} />
          <label>房況</label>
          <select value={manualStatus} onChange={(e) => setManualStatus(e.target.value as RateStatus)}>
            <option value="OPEN">OPEN</option>
            <option value="STOP_SELL">STOP_SELL</option>
          </select>
          <button onClick={manualOverride}>套用手動覆蓋</button>
        </div>

        <div className="card">
          <h2>5) PMS 同步 (FR-15)</h2>
          <p>模擬批次同步，含成功/失敗訊息。</p>
          <div className="row">
            <button className="primary" onClick={syncToPms}>Sync to PMS</button>
            <button className="ghost" onClick={resetDemoData}>重置資料</button>
          </div>
          <p className="sync-msg">{syncMessage || '尚未同步'}</p>
        </div>
      </section>

      <section className="grid two-col">
        <div className="card">
          <h2>事件清單</h2>
          <ul className="list">
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.name}</strong>
                <span>{event.eventDate} / {event.impactLevel}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Audit Logs (NFR-04)</h2>
          <ul className="list">
            {auditLogs.length === 0 && <li><span>尚無紀錄</span></li>}
            {auditLogs.map((log) => (
              <li key={log.id}>
                <strong>{log.action}</strong>
                <span>{log.detail}</span>
                <small>{log.at}</small>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
