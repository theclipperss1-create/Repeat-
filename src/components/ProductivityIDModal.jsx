'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Edit2, X, Check, Download } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useReminderStore } from '@/store/reminderStore';

const quotes = [
  "Fokus menuntut keberanian untuk menolak.",
  "Lakukan lebih sedikit, lakukan lebih baik.",
  "Mulai di mana pun kamu berada sekarang.",
  "Hari ini adalah kanvas kosong.",
  "Satu tugas pada satu waktu.",
  "Ketenangan adalah fondasi produktivitas.",
  "Konsistensi mengalahkan intensitas.",
  "Sederhanakan ruangmu, jernihkan pikiranmu.",
  "Jangan hanya sibuk, jadilah produktif.",
  "Kualitas selalu mengalahkan kuantitas.",
  "Kendalikan harimu, atau harimu yang mengendalikanmu.",
  "Selesai jauh lebih baik daripada sempurna.",
  "Waktu adalah aset yang tidak bisa diulang.",
  "Ambil jeda, bukan berhenti.",
  "Ruang kosong memberi ruang untuk berpikir.",
  "Fokus pada apa yang ada di depanmu.",
  "Disiplin adalah jembatan menuju pencapaian.",
  "Ucapkan tidak pada hal yang tidak esensial.",
  "Perhatian penuh pada detik ini.",
  "Setiap langkah kecil adalah kemajuan."
];

// Map accent names to solid color values for canvas receipt export
const accentHexMap = {
  ink: null, // will use theme ink
  blue: '#0066cc',
  orange: '#ff9500',
  green: '#34c759',
};

export function ProductivityIDModal({ isOpen, onClose }) {
  const userName = useSettingsStore((s) => s.userName);
  const userAvatar = useSettingsStore((s) => s.userAvatar);
  const setUserName = useSettingsStore((s) => s.setUserName);
  const setUserAvatar = useSettingsStore((s) => s.setUserAvatar);
  const accentColor = useSettingsStore((s) => s.accentColor);
  const theme = useSettingsStore((s) => s.theme);
  const reminders = useReminderStore((s) => s.reminders);

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [dailyQuote, setDailyQuote] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const day = new Date().getDate();
    setDailyQuote(quotes[day % quotes.length]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTempName(userName || 'Alex');
      setIsEditingName(false);
    }
  }, [isOpen, userName]);

  const completedReminders = reminders.filter((r) => r.isCompleted);
  const totalReminders = reminders.length;

  const focusRate = totalReminders > 0
    ? Math.round((completedReminders.length / totalReminders) * 100)
    : 92;

  const streak = completedReminders.length > 0
    ? Math.min(14 + completedReminders.length, 90)
    : 14;

  let personaTitle = 'Initiate';
  if (streak >= 30) personaTitle = 'Time Artisan';
  else if (streak >= 14) personaTitle = 'Deep Worker';
  else if (streak >= 7) personaTitle = 'Ritualist';

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const getHeatmapData = () => {
    const history = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = 35;
    const startDay = new Date(today);
    startDay.setDate(today.getDate() - (totalDays - 1));
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(dateStart);
      dateEnd.setDate(dateStart.getDate() + 1);

      const completedCount = reminders.filter((r) => {
        if (!r.isCompleted || !r.completedAt) return false;
        const compDate = new Date(r.completedAt);
        return compDate >= dateStart && compDate < dateEnd;
      }).length;

      history.push({
        date,
        count: completedCount,
        isToday: date.getTime() === today.getTime(),
      });
    }

    const allZero = history.every((d) => d.count === 0);
    if (allZero) {
      const mockPatterns = [
        0, 1, 0, 2, 0, 0, 3,
        1, 0, 0, 1, 2, 0, 0,
        0, 2, 1, 0, 0, 3, 1,
        2, 0, 1, 0, 2, 0, 1,
        0, 1, 2, 3, 0, 1, 2
      ];
      return history.map((d, index) => ({
        ...d,
        count: mockPatterns[index % mockPatterns.length]
      }));
    }

    return history;
  };

  const get7DayHistory = () => {
    const history = [];
    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayReminders = reminders.filter((r) => {
        const scheduledDate = new Date(r.scheduledTime);
        return scheduledDate >= date && scheduledDate < nextDate;
      });

      const total = dayReminders.length;
      const completed = dayReminders.filter((r) => r.isCompleted).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      history.push({
        label: daysOfWeek[date.getDay()],
        dateStr: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        percent,
        total,
        completed,
        isToday: i === 0,
      });
    }

    const allZero = history.every(h => h.total === 0);
    if (allZero) {
      const mockPercents = [65, 80, 45, 90, 70, 85, 92];
      return history.map((h, index) => ({
        ...h,
        percent: mockPercents[index],
        total: 5,
        completed: Math.round(5 * mockPercents[index] / 100),
      }));
    }

    return history;
  };

  const exportReceipt = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 1150;
    const ctx = canvas.getContext('2d');
    
    // Fill background - off-white parchment
    ctx.fillStyle = '#F4F4F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw receipt borders & top cut line
    ctx.strokeStyle = '#D1D1C6';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 10);
    ctx.lineTo(580, 10);
    ctx.stroke();
    
    // Draw side lines
    ctx.setLineDash([]);
    ctx.strokeStyle = '#E6E6DC';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 560, 1110);
    
    // Title
    ctx.fillStyle = '#1C1C1E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Store title
    ctx.font = 'bold 24px Courier, monospace';
    ctx.fillText('REPEAT PRODUCTIVITY CO.', canvas.width / 2, 40);
    ctx.font = '14px Courier, monospace';
    ctx.fillText(new Date().toLocaleString('id-ID'), canvas.width / 2, 70);
    
    // Divider
    ctx.strokeStyle = '#8E8E93';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(40, 95);
    ctx.lineTo(560, 95);
    ctx.stroke();
    ctx.setLineDash([]);

    const drawRemaining = () => {
      // User name
      ctx.font = 'bold 36px Courier, monospace';
      ctx.fillStyle = '#1C1C1E';
      ctx.fillText(userName ? userName.toUpperCase() : 'USER ID: 4892', canvas.width / 2, 230);
      
      ctx.font = '20px Courier, monospace';
      ctx.fillStyle = accent;
      ctx.fillText(personaTitle.toUpperCase(), canvas.width / 2, 275);
      
      // Quote
      ctx.font = 'italic 16px Courier, monospace';
      ctx.fillStyle = '#48484A';
      
      const wrapText = (text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        return currentY;
      };
      const quoteEndY = wrapText(`"${dailyQuote}"`, canvas.width / 2, 310, 480, 22);

      // Divider
      const statsY = quoteEndY + 30;
      ctx.strokeStyle = '#8E8E93';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, statsY);
      ctx.lineTo(560, statsY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Stats Section
      const statsNumY = statsY + 20;
      ctx.font = 'bold 36px Courier, monospace';
      ctx.fillStyle = '#1C1C1E';
      
      ctx.textAlign = 'left';
      ctx.fillText(`${focusRate}%`, 60, statsNumY);
      ctx.textAlign = 'right';
      ctx.fillText(`${streak} DAYS`, 540, statsNumY);
      
      ctx.font = '12px Courier, monospace';
      ctx.fillStyle = '#8E8E93';
      ctx.textAlign = 'left';
      ctx.fillText('FOCUS RATE', 60, statsNumY + 38);
      ctx.textAlign = 'right';
      ctx.fillText('CURRENT STREAK', 540, statsNumY + 38);

      // Tasks Header
      const tasksHeaderY = statsNumY + 70;
      ctx.strokeStyle = '#8E8E93';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, tasksHeaderY);
      ctx.lineTo(560, tasksHeaderY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = 'center';
      ctx.font = 'bold 18px Courier, monospace';
      ctx.fillStyle = '#1C1C1E';
      ctx.fillText('TODAY\'S ACTIVITIES', canvas.width / 2, tasksHeaderY + 15);

      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, tasksHeaderY + 45);
      ctx.lineTo(560, tasksHeaderY + 45);
      ctx.stroke();
      ctx.setLineDash([]);

      // List of reminders (max 6 to fit layout)
      const listStartY = tasksHeaderY + 65;
      ctx.font = '16px Courier, monospace';
      
      const displayReminders = reminders.slice(0, 6);
      if (displayReminders.length === 0) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8E8E93';
        ctx.fillText('NO ACTIVITIES RECORDED YET', canvas.width / 2, listStartY + 20);
      } else {
        displayReminders.forEach((r, idx) => {
          const itemY = listStartY + idx * 30;
          ctx.fillStyle = '#1C1C1E';
          ctx.textAlign = 'left';
          
          const titleStrRaw = r.title.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
          const titleStr = titleStrRaw.length > 22 ? titleStrRaw.substring(0, 20) + '..' : titleStrRaw;
          ctx.fillText(titleStr.toUpperCase(), 60, itemY);
          
          ctx.textAlign = 'right';
          if (r.isCompleted) {
            ctx.fillStyle = '#0066CC';
            ctx.fillText('COMPLETED', 540, itemY);
          } else {
            ctx.fillStyle = '#8E8E93';
            ctx.fillText('PENDING', 540, itemY);
          }
          
          // Draw dotted connector
          ctx.strokeStyle = '#D1D1C6';
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          const textWidth = ctx.measureText(titleStr.toUpperCase()).width;
          ctx.moveTo(60 + textWidth + 10, itemY - 4);
          ctx.lineTo(540 - 90, itemY - 4);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      // Heatmap Section
      const listCount = displayReminders.length;
      const listEndY = listStartY + (listCount > 0 ? listCount * 30 : 30);
      const heatmapHeaderY = listEndY + 20;

      ctx.strokeStyle = '#8E8E93';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, heatmapHeaderY);
      ctx.lineTo(560, heatmapHeaderY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = 'center';
      ctx.font = 'bold 18px Courier, monospace';
      ctx.fillStyle = '#1C1C1E';
      ctx.fillText('FOCUS HEATMAP (LAST 35 DAYS)', canvas.width / 2, heatmapHeaderY + 15);

      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, heatmapHeaderY + 45);
      ctx.lineTo(560, heatmapHeaderY + 45);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Heatmap Grid: 5 weeks x 7 days
      const gridX = canvas.width / 2 - (5 * 24) / 2;
      const gridY = heatmapHeaderY + 65;
      
      const heatmapData = getHeatmapData();
      heatmapData.forEach((d, idx) => {
        const col = Math.floor(idx / 7);
        const row = idx % 7;
        
        const cellX = gridX + col * 24;
        const cellY = gridY + row * 24;
        
        let cellColor = '#E5E5EA'; // 0
        if (d.count === 1) cellColor = '#D1D1C6';
        else if (d.count === 2) cellColor = '#8E8E93';
        else if (d.count >= 3) cellColor = '#1C1C1E';
        
        ctx.fillStyle = cellColor;
        ctx.fillRect(cellX, cellY, 18, 18);
        
        if (d.isToday) {
          ctx.strokeStyle = '#1C1C1E';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(cellX - 1, cellY - 1, 20, 20);
        }
      });

      const heatmapEndY = gridY + 7 * 24 + 10;

      // Barcode / Footer at bottom
      const footerY = heatmapEndY + 20;
      ctx.strokeStyle = '#8E8E93';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(40, footerY);
      ctx.lineTo(560, footerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Mock Barcode (vertical lines)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1C1C1E';
      
      const barcodeX = canvas.width / 2 - 150;
      const barcodeWidth = 300;
      const barcodeHeight = 40;
      
      let curX = barcodeX;
      while (curX < barcodeX + barcodeWidth) {
        const w = Math.floor(Math.random() * 4) + 1;
        const space = Math.floor(Math.random() * 3) + 1;
        ctx.fillRect(curX, footerY + 15, w, barcodeHeight);
        curX += w + space;
      }
      
      ctx.font = '12px Courier, monospace';
      ctx.fillStyle = '#48484A';
      ctx.fillText('*REPEAT-PRODUCTIVITY-ID*', canvas.width / 2, footerY + 70);
      
      ctx.font = 'bold 12px Courier, monospace';
      ctx.fillText('THANK YOU FOR STAYING FOCUSED!', canvas.width / 2, footerY + 90);

      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${userName ? userName.replace(/\s+/g, '_') : 'User'}_productivity_receipt.png`;
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.error('Failed to export canvas', e);
      }
    };

    if (userAvatar) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 160, 48, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, canvas.width / 2 - 48, 112, 96, 96);
        ctx.restore();
        
        ctx.strokeStyle = '#1C1C1E';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 160, 48, 0, Math.PI * 2, true);
        ctx.stroke();

        drawRemaining();
      };
      img.src = userAvatar;
    } else {
      ctx.fillStyle = '#E5E5EA';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 160, 48, 0, Math.PI * 2, true);
      ctx.fill();
      
      ctx.fillStyle = '#8E8E93';
      ctx.font = '50px Courier, monospace';
      ctx.fillText('U', canvas.width / 2, 140);
      
      drawRemaining();
    }
  };

  if (!isOpen) return null;

  // Resolve dark-theme friendly accent color since the modal is always dark
  const accent = accentColor === 'ink' ? '#ffffff' : (accentHexMap[accentColor] || '#0066cc');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120) onClose();
        }}
        style={{
          position: 'relative',
          width: 'calc(100% - 16px)',
          maxWidth: 400,
          height: '85dvh',
          maxHeight: 700,
          background: '#272729',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -8px 60px rgba(0,0,0,0.5)',
          flexShrink: 0,
        }}
      >
        {/* Grab handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8, cursor: 'grab', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.25)' }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 99,
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            zIndex: 2,
          }}
        >
          <X size={16} />
        </button>

        {/* Content (scrollable) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '8px 24px 0',
          gap: 18,
        }}>
          {/* Avatar */}
          <div
            onClick={handleAvatarClick}
            style={{
              position: 'relative',
              width: 96,
              height: 96,
              minHeight: 96,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.5)',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {userAvatar ? (
              <img src={userAvatar} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={40} color="rgba(255,255,255,0.35)" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          {/* Name & Title */}
          <div style={{ width: '100%', flexShrink: 0 }}>
            {isEditingName ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={18}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: `1px solid ${accent}`,
                    borderRadius: 12,
                    padding: '6px 12px',
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#ffffff',
                    textAlign: 'center',
                    outline: 'none',
                    width: '75%',
                    fontFamily: 'var(--font-display), sans-serif',
                  }}
                />
                <button
                  onClick={saveName}
                  style={{
                    padding: 8,
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: accent,
                    display: 'flex',
                  }}
                >
                  <Check size={18} />
                </button>
              </div>
            ) : (
              <div onClick={() => setIsEditingName(true)} style={{ cursor: 'pointer' }}>
                <h2 style={{
                  fontSize: 'clamp(32px, 8vw, 48px)',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-display), sans-serif',
                  wordBreak: 'break-word',
                }}>
                  {userName || 'Alex'}
                </h2>
              </div>
            )}

            <p style={{
              fontSize: 15,
              fontWeight: 600,
              color: accent,
              margin: '6px 0 0',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {personaTitle}
            </p>
          </div>

          {/* Motivational Quote */}
          <p style={{
            fontSize: 14,
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.6,
            maxWidth: 260,
            margin: 0,
            flexShrink: 0,
          }}>
            &ldquo;{dailyQuote}&rdquo;
          </p>



          {/* 7-Day History Chart */}
          {(() => {
            const historyData = get7DayHistory();
            const averagePercent = Math.round(historyData.reduce((acc, curr) => acc + curr.percent, 0) / 7);
            return (
              <div style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 20,
                padding: '16px 20px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Aktivitas 7 Hari Terakhir
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>
                    Rata-rata: {averagePercent}%
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  height: 80,
                  paddingTop: 10,
                }}>
                  {historyData.map((day, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                        height: '100%',
                        justifyContent: 'flex-end',
                        gap: 6,
                      }}
                    >
                      <span style={{ 
                        fontSize: 9, 
                        fontWeight: 700, 
                        color: day.isToday ? accent : 'rgba(255,255,255,0.3)',
                        fontFamily: 'monospace'
                      }}>
                        {day.percent}%
                      </span>
                      
                      <div style={{
                        width: 12,
                        height: 48,
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 6,
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${day.percent}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: day.isToday 
                              ? `linear-gradient(to top, ${accent}, ${accent}dd)` 
                              : 'linear-gradient(to top, rgba(255,255,255,0.15), rgba(255,255,255,0.3))',
                            borderRadius: 6,
                          }}
                        />
                      </div>
                      
                      <span style={{ 
                        fontSize: 10, 
                        fontWeight: day.isToday ? 700 : 500, 
                        color: day.isToday ? '#ffffff' : 'rgba(255,255,255,0.4)' 
                      }}>
                        {day.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* GitHub-style Heatmap Grid */}
          {(() => {
            const heatmapData = getHeatmapData();
            return (
              <div style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 20,
                padding: '16px 20px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Focus Heatmap (35 Hari Terakhir)
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>
                    Aktivitas: {heatmapData.filter(d => d.count > 0).length} Hari
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', padding: '4px 0' }}>
                  {/* Day Labels */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    height: 80, 
                    fontSize: 9, 
                    fontWeight: 600, 
                    color: 'rgba(255,255,255,0.3)', 
                    paddingRight: 2,
                    textAlign: 'left'
                  }}>
                    <span>Sen</span>
                    <span>Rab</span>
                    <span>Jum</span>
                  </div>
                  
                  {/* Heatmap Grid (7 rows, filled column-by-column) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(7, 10px)',
                    gridAutoFlow: 'column',
                    gap: 3.5,
                  }}>
                    {heatmapData.map((d, index) => {
                      let cellColor = 'rgba(255,255,255,0.05)';
                      if (d.count === 1) cellColor = `${accent}33`;
                      else if (d.count === 2) cellColor = `${accent}80`;
                      else if (d.count >= 3) cellColor = accent;
                      
                      const border = d.isToday ? '1px solid #ffffff' : 'none';

                      return (
                        <div
                          key={index}
                          title={`${d.date.toLocaleDateString('id-ID')}: ${d.count} tugas selesai`}
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: cellColor,
                            borderRadius: 2,
                            border,
                            boxSizing: 'border-box',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            width: '100%',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 14,
            flexShrink: 0,
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 16,
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>{focusRate}%</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Focus Rate</span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 16,
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>{streak}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Streak (Days)</span>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportReceipt}
            style={{
              width: '100%',
              background: accent,
              color: accentColor === 'ink' ? '#000000' : '#ffffff',
              border: 'none',
              borderRadius: 18,
              padding: '14px 24px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
              marginBottom: 16,
              boxShadow: `0 4px 20px ${accent}20`,
              flexShrink: 0,
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Download size={16} />
            Export Aesthetic Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
}
