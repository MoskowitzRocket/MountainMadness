import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  drawing: string;
}

const STORAGE_KEY = 'jumblenote_notes';


export const loadNotes = async (): Promise<Note[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
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