interface CalendarEvent {
  summary: string;
  start: string; // ISO 8601 format
  end: string;   // ISO 8601 format
}

interface CreateEventResponse {
  id: string;
}

export async function createEvent(event: CalendarEvent): Promise<CreateEventResponse> {
  const url = process.env.VITE_MAKE_CREATE;
  if (!url) {
    throw new Error('VITE_MAKE_CREATE environment variable is not set.');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create event: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function listEvents(): Promise<CalendarEvent[]> {
  const url = process.env.VITE_MAKE_LIST;
  if (!url) {
    throw new Error('VITE_MAKE_LIST environment variable is not set.');
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list events: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
}
