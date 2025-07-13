import QuickAddForm from "@/components/QuickAddForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Quick GCal</CardTitle>
          <CardDescription>Quickly add events to Google Calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <QuickAddForm />
        </CardContent>
      </Card>
    </main>
  );
}
