
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import NewPlayerForm from "@/components/NewPlayerForm";
import PlayersList from "@/components/PlayersList";
import MatchRecordForm from "@/components/MatchRecordForm";
import EventSelector from "@/components/EventSelector";
import Auth from "@/components/Auth";
import { processMatch, type Player, type Match, type Event } from "@/utils/eloCalculator";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Create super admin account if it doesn't exist
    createSuperAdmin();

    return () => subscription.unsubscribe();
  }, []);

  const createSuperAdmin = async () => {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select()
      .eq('email', 'gersiedee')
      .single();

    if (!existingUser) {
      const { error } = await supabase.auth.signUp({
        email: 'gersiedee',
        password: 'MageGael2019',
        options: {
          data: {
            role: 'super_admin',
          },
        },
      });

      if (!error) {
        console.log('Super admin account created');
      }
    }
  };

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      rating: 1200,
      matches: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  const handleCreateEvent = async (name: string) => {
    if (!session?.user) return;

    const newEvent: Event = {
      id: uuidv4(),
      name,
      date: new Date().toISOString(),
      isActive: true,
    };

    // Save event to Supabase
    const { error } = await supabase
      .from('events')
      .insert([
        {
          ...newEvent,
          creator_id: session.user.id,
        },
      ]);

    if (error) {
      console.error('Error creating event:', error);
      return;
    }

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-chess-light to-white dark:from-chess-dark dark:to-black p-8">
        <Auth onAuthSuccess={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-chess-light to-white dark:from-chess-dark dark:to-black">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-2">Chess Club ELO Tracker</h1>
          <p className="text-muted-foreground">Track matches and player ratings</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </Button>
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
