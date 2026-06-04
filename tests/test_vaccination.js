// Run: node tests/test_vaccination.js
const { calculateSchedule, getMonthsAge } = require('../vaccination.js');

let pass = 0, fail = 0;
function assert(condition, msg) {
  if (condition) { console.log(`  ✓ ${msg}`); pass++; }
  else { console.error(`  ✗ ${msg}`); fail++; }
}

const d6m = new Date();
d6m.setMonth(d6m.getMonth() - 6);
const birth6m = d6m.toISOString().split('T')[0];

assert(getMonthsAge(birth6m) === 6, 'getMonthsAge: 6ヶ月前 → 6');
assert(getMonthsAge(new Date().toISOString().split('T')[0]) === 0, 'getMonthsAge: 今日 → 0');

const schedule = calculateSchedule(birth6m);
assert(Array.isArray(schedule), 'calculateSchedule: 配列を返す');
assert(schedule.length === 24, `calculateSchedule: 24件 (got ${schedule.length})`);

const item = schedule[0];
['id','name','startMonths','endMonths','startDate','endDate',
 'startDateStr','endDateStr','isPast','isUpcoming'].forEach(k =>
  assert(k in item, `item has '${k}'`)
);

assert(schedule.filter(v => v.isUpcoming).length > 0, '6ヶ月児にupcomingワクチンがある');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
