import React from 'react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MiniCalendar({ routineDays = [], rescheduledDate }) {
    // routineDays is an array of integers representing days of the week (0 = Sun, 1 = Mon, etc.)
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const allSlots = [...blanks, ...days];

    const isRoutineDay = (dayNum) => {
        if (!dayNum || !routineDays) return false;
        const dateObj = new Date(currentYear, currentMonth, dayNum);
        return routineDays.includes(dateObj.getDay());
    };

    const isRescheduled = (dayNum) => {
        if (!dayNum || !rescheduledDate) return false;
        const rDate = new Date(rescheduledDate);
        return rDate.getDate() === dayNum && rDate.getMonth() === currentMonth && rDate.getFullYear() === currentYear;
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
            <h4 style={{ textAlign: 'center', margin: '0 0 16px 0', fontSize: '14px', color: 'var(--c-text-primary)' }}>
                {today.toLocaleString('default', { month: 'long' })} {currentYear}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--c-text-secondary)', marginBottom: '8px' }}>
                        {day}
                    </div>
                ))}
                {allSlots.map((dayNum, idx) => {
                    const routine = isRoutineDay(dayNum);
                    const resched = isRescheduled(dayNum);

                    let bg = 'transparent';
                    let color = 'var(--c-text-secondary)';
                    let border = '1px solid transparent';

                    if (dayNum) {
                        if (resched) {
                            bg = 'rgba(255, 107, 107, 0.2)';
                            border = '1px solid #ff6b6b';
                            color = '#ff6b6b';
                        } else if (routine) {
                            bg = 'rgba(0, 168, 232, 0.2)';
                            border = '1px solid var(--c-accent-1)';
                            color = 'var(--c-text-primary)';
                        }
                    }

                    return (
                        <div key={idx} style={{
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '6px',
                            background: bg,
                            border: border,
                            color: dayNum ? color : 'transparent',
                            fontSize: '12px',
                            fontWeight: (routine || resched) ? 'bold' : 'normal'
                        }}>
                            {dayNum || ''}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', fontSize: '10px', color: 'var(--c-text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'rgba(0, 168, 232, 0.2)', border: '1px solid var(--c-accent-1)', borderRadius: '2px' }}></div>
                    Routine
                </div>
                {rescheduledDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', background: 'rgba(255, 107, 107, 0.2)', border: '1px solid #ff6b6b', borderRadius: '2px' }}></div>
                        Rescheduled
                    </div>
                )}
            </div>
        </div>
    );
}
