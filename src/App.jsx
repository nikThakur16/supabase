import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Toaster, toast } from "react-hot-toast";

import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [text, setText] = useState("");
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const TABLE = "Nikhiltable";

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("id, text")
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("Fetch error:", error);
      } else if (data) {
        setRowId(data.id);
        setText(data.text);
      }
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);

    if (rowId) {
      const { error } = await supabase
        .from(TABLE)
        .update({ text })
        .eq("id", rowId);

      if (error) {
        console.error("Update error:", error);
        toast.error("Failed to Save");
      } else {
   
          toast.success("Saved successfully!");
    
      }
    } else {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({ text })
        .select("id")
        .single();

      if (error) {
        console.error("Insert error:", error);
        toast.error("Failed to create Save");
      } else {
        setRowId(data.id);
     
          toast.success("Saved successfully!");

      }
    }

 
      setLoading(false);
  
  };

  return (
    <div class="radial-background">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container">
        <h1>Enter Your Prompt :</h1>

        <form onSubmit={handleSubmit}>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="note-area"
            placeholder="Write something..."
          />

          {loading ? (
            <button class="btn">
              <span class="loader"></span>
            </button>
          ) : (
            <button>
              <span id="span">Save</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;

