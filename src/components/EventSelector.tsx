
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Event } from "@/utils/eloCalculator";

interface EventSelectorProps {
  events: Event[];
  activeEventId: string | null;
  onEventCreate: (name: string) => void;
  onEventSelect: (eventId: string) => void;
}

const EventSelector = ({
  events,
  activeEventId,
  onEventCreate,
  onEventSelect,
}: EventSelectorProps) => {
  const [newEventName, setNewEventName] = useState("");

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }

    onEventCreate(newEventName.trim());
    setNewEventName("");
    toast.success("Event created successfully");
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Event Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Event Name</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                placeholder="Enter event name"
              />
              <Button type="submit">Create</Button>
            </div>
          </div>
        </form>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Active Event</label>
          <Select 
            value={activeEventId || ""} 
            onValueChange={onEventSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name} ({new Date(event.date).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventSelector;
