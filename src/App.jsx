import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import  './App.css'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  const [text, setText] = useState('')
  const [rowId, setRowId] = useState(null)
  const [loading, setLoading] = useState(true)
  const TABLE = 'Nikhiltable'

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select('id, text')
        .limit(1)
        .maybeSingle()
      if (error) {
        console.error('Fetch error:', error)
      } else if (data) {
        setRowId(data.id)
        setText(data.text)
      }
      setLoading(false)
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    if (rowId) {
      const { error } = await supabase
        .from(TABLE)
        .update({ text })
        .eq('id', rowId)
      if (error) console.error('Update error:', error)
    } else {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({ text })
        .select('id')
        .single()
      if (error) {
        console.error('Insert error:', error)
      } else {
        setRowId(data.id)
      }
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <h1>Supabase Note</h1>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="note-area"
            placeholder="Write something..."
          />
          <button type="submit" className="btn">
            {rowId ? 'Update' : 'Create'}
          </button>
        </form>
      )}
    </div>
  )
}

export default App
