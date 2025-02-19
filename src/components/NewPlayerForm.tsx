
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NewPlayerFormProps {
  onPlayerAdd: (name: string) => void;
}

const NewPlayerForm = ({ onPlayerAdd }: NewPlayerFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a player name");
      return;
    }

    onPlayerAdd(name.trim());
    setName("");
    toast.success("Player added successfully");
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Add New Player</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Player Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter player name"
            />
          </div>
          <Button type="submit" className="w-full">
            Add Player
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewPlayerForm;
