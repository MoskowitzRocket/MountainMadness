import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { loadNotes, Note } from "../utils/notesStorage";

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Display splash screen for at least 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        const storedNotes = await loadNotes();
        setNotes(storedNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Refresh notes when the screen is focused (coming back from note edit)
  useFocusEffect(
    useCallback(() => {
      const loadAllNotes = async () => {
        const storedNotes = await loadNotes();
        setNotes(storedNotes);
      };
      
      loadAllNotes();
    }, [])
  );

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Show brief note preview
  const getPreview = (content: string) => {
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  };

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.jumbleTitle}>JUMBLENOTE</Text>
        <Text style={styles.jumbleSubtitle}>THE ONLY NOTETAKING APP YOU WILL EVER NEED</Text>
        <ActivityIndicator size="large" color="#000" style={{marginTop: 20}} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>JUMBLENOTE</Text>
      
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a note..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.sortButton}>
          <Text>↕</Text>
        </TouchableOpacity>
      </View>

      {/* List of notes */}
      <ScrollView style={styles.noteList}>
        {filteredNotes.length === 0 ? (
          <Text style={styles.emptyMessage}>No notes yet. Create your first note!</Text>
        ) : (
          filteredNotes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.noteItem}
              onPress={() => router.push(`/note/${note.id}`)}
            >
              <View>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
                <Text style={styles.notePreview}>{getPreview(note.content)}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add Note button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/note/new')}
      >
        <Text style={styles.addButtonText}>✎</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Splash screen styles
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  jumbleTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jumbleSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Main app styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sortButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteList: {
    flex: 1,
  },
  noteItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noteDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  notePreview: {
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333",
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
}); 