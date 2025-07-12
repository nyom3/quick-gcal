import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EventForm() {
  return (
    <form>
      <div>
        <Label htmlFor="summary">Event Title</Label>
        <Input id="summary" type="text" />
      </div>
      <div>
        <Label htmlFor="start">Start Date</Label>
        <Input id="start" type="datetime-local" />
      </div>
      <div>
        <Label htmlFor="end">End Date</Label>
        <Input id="end" type="datetime-local" />
      </div>
      <Button type="submit">Add Event</Button>
    </form>
  );
}
