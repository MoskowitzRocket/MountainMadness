import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";

export default function Index() {
  const [notes, setNotes] = useState<Array<{id: number, title: string, content: string, date: string}>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add sample notes
      if (notes.length === 0) {
        setNotes([
          { id: 1, title: "John's Skincare Routine", content: "exfoliator, moisturizer...", date: "2013-06-18" },
          { id: 2, title: "Date Ideas", content: "lol you're single, remember?", date: "2082-10-23" },
          { id: 3, title: "Shopping List", content: "Eggs, knife, oats, peanuts...", date: "2025-05-05" },
          { id: 4, title: "Things that John likes", content: "Horses, dogs, flowers, b...", date: "1998-03-23" },
          { id: 5, title: "Brainrot Dictionary for Dad", content: "Level 10 gyatt, sigma boy,...", date: "2013-01-27" },
          { id: 6, title: "Homework Checklist", content: "Lorem ipsum dolor sit...", date: "2024-10-03" },
        ]);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.jumbleTitle}>JUMBLENOTE</Text>
        <Text style={styles.jumbleSubtitle}>THE ONLY NOTETAKING APP YOU WILL EVER NEED</Text>
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
        {filteredNotes.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={styles.noteItem}
            onPress={() => router.push(`/note/${note.id}`)}
          >
            <View>
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
              <Text style={styles.notePreview}>{note.content}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
}); 