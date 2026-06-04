const VACCINE_SCHEDULE = [
  { id: '5mix_1',      name: '5種混合 1回目',            startMonths: 2,  endMonths: 12, note: 'ジフテリア・百日咳・破傷風・ポリオ・ヒブ' },
  { id: 'pcv_1',       name: '肺炎球菌 1回目',            startMonths: 2,  endMonths: 7  },
  { id: 'hepb_1',      name: 'B型肝炎 1回目',             startMonths: 2,  endMonths: 9  },
  { id: 'rota_1',      name: 'ロタウイルス 1回目',        startMonths: 2,  endMonths: 4  },
  { id: '5mix_2',      name: '5種混合 2回目',            startMonths: 3,  endMonths: 12, note: 'ジフテリア・百日咳・破傷風・ポリオ・ヒブ' },
  { id: 'pcv_2',       name: '肺炎球菌 2回目',            startMonths: 3,  endMonths: 8  },
  { id: 'hepb_2',      name: 'B型肝炎 2回目',             startMonths: 3,  endMonths: 9  },
  { id: 'rota_2',      name: 'ロタウイルス 2回目',        startMonths: 3,  endMonths: 5  },
  { id: '5mix_3',      name: '5種混合 3回目',            startMonths: 4,  endMonths: 12, note: 'ジフテリア・百日咳・破傷風・ポリオ・ヒブ' },
  { id: 'pcv_3',       name: '肺炎球菌 3回目',            startMonths: 4,  endMonths: 7  },
  { id: 'rota_3',      name: 'ロタウイルス 3回目（5価）',startMonths: 4,  endMonths: 8  },
  { id: 'bcg',         name: 'BCG',                       startMonths: 5,  endMonths: 8  },
  { id: 'hepb_3',      name: 'B型肝炎 3回目',             startMonths: 7,  endMonths: 9  },
  { id: '5mix_4',      name: '5種混合 追加接種',          startMonths: 12, endMonths: 24, note: 'ジフテリア・百日咳・破傷風・ポリオ・ヒブ' },
  { id: 'pcv_4',       name: '肺炎球菌 追加接種',         startMonths: 12, endMonths: 15 },
  { id: 'mr_1',        name: 'MR（麻疹・風疹）1期',      startMonths: 12, endMonths: 24 },
  { id: 'varicella_1', name: '水痘 1回目',                startMonths: 12, endMonths: 15 },
  { id: 'varicella_2', name: '水痘 2回目',                startMonths: 18, endMonths: 36 },
  { id: 'je_1',        name: '日本脳炎 1期 1回目',       startMonths: 36, endMonths: 48 },
  { id: 'je_2',        name: '日本脳炎 1期 2回目',       startMonths: 37, endMonths: 48 },
];

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function getMonthsAge(birthdateStr) {
  const birth = new Date(birthdateStr);
  const today = new Date();
  const months = (today.getFullYear() - birth.getFullYear()) * 12
    + (today.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

function calculateSchedule(birthdateStr) {
  const birth = new Date(birthdateStr);
  const today = new Date();
  return VACCINE_SCHEDULE.map(v => {
    const startDate = addMonths(birth, v.startMonths);
    const endDate = addMonths(birth, v.endMonths);
    return {
      ...v,
      startDate,
      endDate,
      startDateStr: formatDate(startDate),
      endDateStr: formatDate(endDate),
      isPast: endDate < today,
      isUpcoming: startDate <= today && endDate >= today,
    };
  });
}

if (typeof module !== 'undefined') {
  module.exports = { VACCINE_SCHEDULE, calculateSchedule, getMonthsAge };
}
