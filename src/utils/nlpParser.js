import { useSettingsStore } from '@/store/settingsStore';

export function parseReminderInput(input) {
  const lowerInput = input.trim().toLowerCase();

  // Strict Scope Guardrails: Check if input is out of scope (recipes, weather, politics, general chat, etc.)
  const outOfScopeKeywords = [
    'resep', 'masak', 'cooking', 'recipe', 'cuaca', 'weather', 'suhu', 'hujan', 'presiden', 'politik', 
    'siapa', 'mengapa', 'kenapa', 'apakah', 'bagaimana', 'puisi', 'cerita', 'pantun', 'lelucon', 'joke',
    'siapa nama', 'siapa kamu', 'apa itu', 'jelaskan', 'terjemahkan', 'translate', 'hitung', 'rumus',
    'bintang', 'planet', 'luar angkasa', 'berita', 'news', 'gosip', 'artis', 'negara', 'dunia', 'sejarah'
  ];

  const isQuestion = lowerInput.endsWith('?') || lowerInput.includes('?');
  const taskIndicators = [
    'inget', 'ingatkan', 'jadwal', 'remind', 'alarm', 'tugas', 'makan', 'minum', 'kerjakan', 'baca', 
    'rapat', 'pergi', 'bangun', 'tidur', 'olahraga', 'belajar', 'beli', 'jemput', 'antar', 'rutinitas', 'meeting'
  ];

  const hasTaskIndicator = taskIndicators.some(kw => lowerInput.includes(kw));
  const hasOutOfScopeWord = outOfScopeKeywords.some(kw => lowerInput.includes(kw));

  // If the query contains off-topic words, or is a general question without task indicators
  if (hasOutOfScopeWord || (isQuestion && !hasTaskIndicator)) {
    return {
      status: 'error',
      message: 'out_of_scope'
    };
  }

  // 1. Determine Category
  let category = 'task';
  const autoCategorization = useSettingsStore.getState().autoCategorization;
  
  if (autoCategorization) {
    const medicineKeywords = ['minum', 'obat', 'paracetamol', 'antibiotik', 'pil', 'vitamin', 'suplemen'];
    const mealKeywords = ['makan', 'sarapan', 'siang', 'malam', 'puasa', 'diet', 'dinner', 'lunch', 'breakfast'];
    
    if (medicineKeywords.some(kw => lowerInput.includes(kw))) {
      category = 'medicine';
    } else if (mealKeywords.some(kw => lowerInput.includes(kw))) {
      category = 'meal';
    }
  }

  // 2. Determine Time
  let scheduledTime = new Date();
  let timeFound = false;

  // Pattern: "X menit lagi"
  const menitLagiMatch = lowerInput.match(/(\d+)\s*menit\s*lagi/);
  if (menitLagiMatch) {
    const minutes = parseInt(menitLagiMatch[1], 10);
    scheduledTime.setMinutes(scheduledTime.getMinutes() + minutes);
    timeFound = true;
  }
  
  // Pattern: "X jam lagi"
  if (!timeFound) {
    const jamLagiMatch = lowerInput.match(/(\d+)\s*jam\s*lagi/);
    if (jamLagiMatch) {
      const hours = parseInt(jamLagiMatch[1], 10);
      scheduledTime.setHours(scheduledTime.getHours() + hours);
      timeFound = true;
    }
  }

  // Pattern: "jam X" or "pukul X"
  if (!timeFound) {
    const jamMatch = lowerInput.match(/(?:jam|pukul)\s*(\d{1,2})(?:\s*[:.]\s*(\d{1,2}))?\s*(pagi|siang|sore|malam)?/);
    if (jamMatch) {
      let hours = parseInt(jamMatch[1], 10);
      const minutes = jamMatch[2] ? parseInt(jamMatch[2], 10) : 0;
      const ampm = jamMatch[3];

      if (ampm) {
        if ((ampm === 'sore' || ampm === 'malam') && hours < 12) {
          hours += 12;
        } else if (ampm === 'pagi' && hours === 12) {
          hours = 0;
        }
      } else {
        // Infer AM/PM based on current time
        const currentHour = scheduledTime.getHours();
        if (hours < currentHour && hours < 12 && (hours + 12) > currentHour) {
          hours += 12; // Assume PM if the hour has already passed today
        }
      }

      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If the parsed time is in the past, assume tomorrow
      if (scheduledTime < new Date()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      timeFound = true;
    }
  }
  
  // Default fallback: 15 minutes from now if no time specified
  if (!timeFound) {
    scheduledTime.setMinutes(scheduledTime.getMinutes() + 15);
  }

  // 3. Clean up Title (remove time phrases)
  let title = input
    .replace(/(\d+)\s*menit\s*lagi/i, '')
    .replace(/(\d+)\s*jam\s*lagi/i, '')
    .replace(/(?:jam|pukul)\s*(\d{1,2})(?:\s*[:.]\s*(\d{1,2}))?\s*(pagi|siang|sore|malam)?/i, '')
    .replace(/ingetin(?: aku)?\s*(?:untuk|buat)?/i, '') // Remove "ingetin aku"
    .replace(/tolong\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize first letter
  if (title) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  } else {
    title = "Quick Reminder";
  }

  return {
    status: 'success',
    data: {
      title,
      category,
      scheduledTime: scheduledTime.toISOString(),
    }
  };
}
