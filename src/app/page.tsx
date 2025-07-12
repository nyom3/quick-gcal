import CalendarView from '@/components/CalendarView';
import EventForm from '@/components/EventForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quick Google Calendar</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <CalendarView />
        </div>
        <div>
          <EventForm />
          <div className="mt-4">
            <Input placeholder="Test Input" />
            <Button className="mt-2">Test Button</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
