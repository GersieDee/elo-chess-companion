
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import NewPlayerForm from "@/components/NewPlayerForm";
import PlayersList from "@/components/PlayersList";
import MatchRecordForm from "@/components/MatchRecordForm";
import { processMatch, type Player, type Match } from "@/utils/eloCalculator";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      rating: 1200, // Starting ELO rating
      matches: 0,
    };
    setPlayers([...players, newPlayer]);
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
            <NewPlayerForm onPlayerAdd={handleAddPlayer} />
            <MatchRecordForm players={players} onMatchRecord={handleRecordMatch} />
          </div>
          <PlayersList players={players} />
        </div>
      </div>
    </div>
  );
};

export default Index;
