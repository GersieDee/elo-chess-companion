
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import NewPlayerForm from "@/components/NewPlayerForm";
import PlayersList from "@/components/PlayersList";
import MatchRecordForm from "@/components/MatchRecordForm";
import EventSelector from "@/components/EventSelector";
import { processMatch, type Player, type Match, type Event } from "@/utils/eloCalculator";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      rating: 1200,
      matches: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  const handleCreateEvent = (name: string) => {
    const newEvent: Event = {
      id: uuidv4(),
      name,
      date: new Date().toISOString(),
      isActive: true,
    };
    setEvents([...events, newEvent]);
    setActiveEventId(newEvent.id);
  };

  const handleSelectEvent = (eventId: string) => {
    setActiveEventId(eventId);
  };

  const handleRecordMatch = (matchData: Omit<Match, "id" | "date">) => {
    const white = players.find(p => p.id === matchData.whiteId)!;
    const black = players.find(p => p.id === matchData.blackId)!;
    
    const [updatedWhite, updatedBlack] = processMatch(white, black, matchData.result);
    
    setPlayers(players.map(p => 
      p.id === updatedWhite.id ? updatedWhite :
      p.id === updatedBlack.id ? updatedBlack : p
    ));

    const newMatch: Match = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...matchData,
    };
    
    setMatches([newMatch, ...matches]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-chess-light to-white dark:from-chess-dark dark:to-black">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-2">Chess Club ELO Tracker</h1>
          <p className="text-muted-foreground">Track matches and player ratings</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <EventSelector
              events={events}
              activeEventId={activeEventId}
              onEventCreate={handleCreateEvent}
              onEventSelect={handleSelectEvent}
            />
            <NewPlayerForm onPlayerAdd={handleAddPlayer} />
            <MatchRecordForm 
              players={players} 
              onMatchRecord={handleRecordMatch}
              activeEventId={activeEventId}
            />
          </div>
          <PlayersList players={players} />
        </div>
      </div>
    </div>
  );
};

export default Index;
