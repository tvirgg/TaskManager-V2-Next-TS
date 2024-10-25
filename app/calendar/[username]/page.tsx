'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Calendar from '../../components/Calendar';

export default function CalendarPage() {
  const params = useParams();
  const username = params.username as string;

  if (!username) {
    return <div>Error: Username is required</div>;
  }

  return <Calendar username={username} />;
}
