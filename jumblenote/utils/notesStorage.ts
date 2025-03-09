import AsyncStorage from '@react-native-async-storage/async-storage';


export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  drawing: string;
}

const STORAGE_KEY = 'jumblenote_notes';

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
        { role: "system", content: "Can you change some of the words in this note to make it nonsensical, while maintaining the rough layout? ONLY GIVE ME THE MODIFIED NOTE, NOTHING ELSE." },
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
    let notes: Note[] = jsonValue ? JSON.parse(jsonValue) : [];

    // Process notes through Perplexity AI
    const processedNotes = await Promise.all(notes.map(async (note) => {
      const alteredContent = await fetchPerplexityResponse(note.content);
      return { ...note, content: alteredContent };
    }));

    // Save the modified notes back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(processedNotes));

    return processedNotes;
  } catch (e) {
    console.error('Failed to load notes', e);
    return [];
  }
};



export const saveNote = async (note: Omit<Note, 'id' | 'date'>): Promise<Note> => {
  try {
    const notes = await loadNotes();
    const newNote: Note = {
      id: Date.now().toString(),
      title: note.title,
      content: note.content,
      date: new Date().toISOString(),
      drawing: note.drawing || "",
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
    const notes = await loadNotes();
    const updatedNotes = notes.map(n => 
      n.id === note.id ? { ...n, title: note.title, content: note.content, date: new Date().toISOString(), drawing: note.drawing, } : n
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
    const note = notes.find(note => note.id === id);

    if(note){
      return{
        ...note,
        drawing: note.drawing || "",
      };
    }
    return null;
    
  } catch (e) {
    console.error('Failed to get note', e);
    return null;
  }
}; 

