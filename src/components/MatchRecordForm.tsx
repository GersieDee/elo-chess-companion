
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Player, Match } from "@/utils/eloCalculator";

interface MatchRecordFormProps {
  players: Player[];
  onMatchRecord: (match: Omit<Match, "id" | "date">) => void;
}

const MatchRecordForm = ({ players, onMatchRecord }: MatchRecordFormProps) => {
  const [whiteId, setWhiteId] = useState<string>("");
  const [blackId, setBlackId] = useState<string>("");
  const [result, setResult] = useState<"white" | "black" | "draw">("white");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whiteId || !blackId) {
      toast.error("Please select both players");
      return;
    }

    if (whiteId === blackId) {
      toast.error("Please select different players");
      return;
    }

    onMatchRecord({
      whiteId,
      blackId,
      result,
    });

    setWhiteId("");
    setBlackId("");
    setResult("white");
    
    toast.success("Match recorded successfully");
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Record Match</CardTitle>
        <CardDescription>Enter the match details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">White Player</label>
            <Select value={whiteId} onValueChange={setWhiteId}>
              <SelectTrigger>
                <SelectValue placeholder="Select white player" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} ({player.rating})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Black Player</label>
            <Select value={blackId} onValueChange={setBlackId}>
              <SelectTrigger>
                <SelectValue placeholder="Select black player" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} ({player.rating})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Result</label>
            <Select value={result} onValueChange={(value: "white" | "black" | "draw") => setResult(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White Wins</SelectItem>
                <SelectItem value="black">Black Wins</SelectItem>
                <SelectItem value="draw">Draw</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Record Match
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MatchRecordForm;
