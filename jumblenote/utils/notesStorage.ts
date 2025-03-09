import AsyncStorage from '@react-native-async-storage/async-storage';


export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const STORAGE_KEY = 'jumblenote_notes';

const original_prompt = "Can you change some of the words in this note to make it nonsensical, while maintaining the rough layout? ONLY GIVE ME THE MODIFIED NOTE, NOTHING ELSE."
          + "If the input is nonsensical, dont change it. Remove quotation marks. Use gen Alpha and brainrot SLANG sparingly" + 
          " NEVER FUCKING EVER GIVE ME A RESPONSE LIKE THIS It seems like you've entered a string of random characters. Could you please clarify or provide more context about what you're asking? I'm here to help with any questions or information you need" + 
          " dont ever show your reasoning!!! DO NOT FUCKING SAY becomes or show any proof of writing ths new text. Just give me the changed text and nothing else" + 
        "dont give me a response like this fvejgpoiafejwvdpoijfvapirjvidojapgowjfopiwejvpagopfiewjcoij!!! becomes: fvejgpoiafejwvdpoijfvapirjvidojapgowjfopiwejvpagopfiewjcoij!!! Since the input is already nonsensical, no changes are made." + 
        "dont tell me a messaeg has been modified PLEASE";

const CAMERON_PROMPT = "Good evening mr. AI, I come to you today to ask you to rewrite some notes that I've taken. I want you to change them using brainrot slang to have it appear I'm descending into madness. Be whimsical and  imaginative but keep the length of the text relatively, not exactly, similar to the original. Try to keep the structure of the note similar to the original but you can be as liberal with the contents as you like besides this. The string you give me should have NOTHING except the note, do not give me ANY FURTHER EXPLANATION. I DO NOT WANT TO KNOW YOUR PROCESS. If the note is already nonsensical just return the exact same note. DO NOT SAY THAT YOU ARE RETURNING THE SAME THING. Just return the same thing. PLEASE I AM BEGGING LISTEN TO ME. DO NOT SAY \"your prompt now become this\" DO NOT TELL ME WHAT YOU ARE DOING OR WHY. JUST RETURN THE NOTE. ONLY THE NOTE. FUCK you, you useless robot. ";
const fetchPerplexityResponse = async (input: string): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content:  CAMERON_PROMPT},
        { role: "user", content: input },
      ],
      max_tokens: 123,
      temperature: 0.2,
      top_p: 0.9,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
    }),
  };

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', options);
    const data = await response.json();
    return typeof data.choices?.[0]?.message?.content === 'string' 
  ? data.choices[0].message.content 
  : input; // Fallback to original content
 // Return modified text or original if error
  } catch (err) {
    console.error('Error fetching response from Perplexity:', err);
    return input; // Return original text if API call fails
  }
};

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load notes', e);
    return [];
  }
};

export const saveNote = async (note: Omit<Note, 'id' | 'date'>): Promise<Note> => {
  try {
    // Process note content through Perplexity AI before saving
    const alteredContent = await fetchPerplexityResponse(note.content);
    
    const notes = await loadNotes();
    const newNote: Note = {
      id: Date.now().toString(),
      title: note.title,
      content: alteredContent, // Save the altered content
      date: new Date().toISOString(),
    };
    
    const updatedNotes = [...notes, newNote];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    return newNote;
  } catch (e) {
    console.error('Failed to save note', e);
    throw e;
  }
};





export const updateNote = async (note: Note): Promise<void> => {
  try {
    // Process note content through Perplexity AI before updating
    const alteredContent = await fetchPerplexityResponse(note.content);
    
    const notes = await loadNotes();
    const updatedNotes = notes.map(n => 
      n.id === note.id ? { ...note, content: alteredContent, date: new Date().toISOString() } : n
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (e) {
    console.error('Failed to update note', e);
    throw e;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    const notes = await loadNotes();
    const updatedNotes = notes.filter(note => note.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (e) {
    console.error('Failed to delete note', e);
    throw e;
  }
};


export const getNoteById = async (id: string): Promise<Note | null> => {
  try {
    const notes = await loadNotes();
    return notes.find(note => note.id === id) || null;
  } catch (e) {
    console.error('Failed to get note', e);
    return null;
  }
}; 

