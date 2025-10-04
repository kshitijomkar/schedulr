// client/src/app/(dashboard)/timetables/TimetableGrid.tsx
"use client"

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ScheduledClass {
    _id: string;
    day: string;
    timeSlot: { _id: string; period: number; startTime: string; endTime: string; };
    subject: { name: string; };
    faculty: { name: string; }[];
    classroom: { name: string; };
    labBatchNumber?: number;
}

interface TimetableGridProps {
    schedule: ScheduledClass[];
}

export function TimetableGrid({ schedule }: TimetableGridProps) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = Array.from({ length: 7 }, (_, i) => i + 1); // Assuming 7 periods

    // Organize the schedule data into a grid for easy lookup
    const scheduleMap = useMemo(() => {
        const map = new Map<string, ScheduledClass[]>();
        schedule.forEach(item => {
            const key = `${item.day}-${item.timeSlot.period}`;
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push(item);
        });
        return map;
    }, [schedule]);
    
    if (schedule.length === 0) {
        return (
            <div className="text-center p-8 rounded-lg border-2 border-dashed">
                <h3 className="text-lg font-semibold">No Schedule Found</h3>
                <p className="text-muted-foreground mt-2">Generate a new timetable to see the results here.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm min-w-[1200px]">
                <div className="grid grid-cols-[100px_repeat(7,1fr)]">
                    <div className="font-bold p-2 border-b border-r">Day/Period</div>
                    {periods.map(period => (
                        <div key={period} className="font-bold p-2 text-center border-b">Period {period}</div>
                    ))}
                    {days.map(day => (
                        <React.Fragment key={day}>
                            <div className="font-bold p-2 border-r">{day}</div>
                            {periods.map(period => {
                                const key = `${day}-${period}`;
                                const classes = scheduleMap.get(key);
                                return (
                                    <div key={key} className="p-2 border-l border-t min-h-[120px]">
                                        {classes && classes.map(cls => (
                                            <div key={cls._id} className="text-xs p-1 mb-1 bg-muted rounded">
                                                <p className="font-bold">{cls.subject.name} {cls.labBatchNumber ? `(B${cls.labBatchNumber})` : ''}</p>
                                                <p>{cls.faculty.map(f => f.name).join(', ')}</p>
                                                <p className="text-muted-foreground">{cls.classroom.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}