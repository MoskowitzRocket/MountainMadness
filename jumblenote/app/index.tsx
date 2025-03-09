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
  const [notes, setNotes] = useState<Array<{ id: number, title: string, content: string, date: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add sample notes
      if (notes.length === 0) {
        setNotes([
          { id: 1, title: "John's Skincare Routinessssssssssssssssssssssssssssssssssss", content: "How much wood can a woodchuck chuck if a wood chuck could chuck wood? Go to sleep, John. No. Why? There are monsters under my bed. Seriously, you're a grown ass man. NO! You are not my mother. Okay, but I am your wife. Either go to bed or take your schizo comms to the living room. Okay. Goodnight., moisturizer...", date: "2013-06-18" },
          { id: 2, title: "Date Ideas", content: "lol you're single, remember?", date: "2082-10-23" },
          { id: 3, title: "Shopping List", content: "Eggs, knife, peanuts...", date: "2025-05-05" },
          { id: 4, title: "Things that John likes", content: "Horses, dewfewfefwogs, flowers, b...", date: "1998-03-23" },
          { id: 5, title: "Brainrot Dictionary for Dad", content: "Levewefefwwefl 10 gyatt, sigma boy,...", date: "2013-01-27" },
          { id: 6, title: "Homework Checklist", content: "Lorem ipsum wefefwfewdolor sit...", date: "2024-10-03" },
          { id: 7, title: "Homework Checklist", content: "Lorem ipsum wefefwfewdolor sit...", date: "2024-10-03" },
          { id: 8, title: "Homework Checklist", content: "Lorem ipsum wefefwfewdolor sit...", date: "2024-10-03" },
          { id: 9, title: "Homework Checklist", content: "Lorem ipsum wefefwfewdolor sit...", date: "2024-10-03" },
          { id: 10, title: "Homework Checklist", content: "Lorem ipsum wefefwfewdolor sit...", date: "2024-10-03" },

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
        <Image
          source={require("../assets/images/home slogan.png")}
          style={{ width: 330, height: 160, top: -60 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/list title.png")}
        style={{ width: 240, height: 90, marginTop: 45, marginLeft: 45, marginRight: 45 }}
      />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a note..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
                <Text style={styles.notePreview}>{note.content}</Text>
              </View>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Note button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/note/new')}
      >
        <Text style={styles.addButtonText}>+</Text>
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
    fontFamily: 'Mohave',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  jumbleSubtitle: {
    fontFamily: 'Mohave',
    fontSize: 14,
    textAlign: 'center',
  },

  // Main app styles
  container: {
    fontFamily: 'Mohave',
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  header: {
    paddingTop: 20,
    fontFamily: 'Mohave',
    fontSize: 48,
    fontWeight: "500",
    textAlign: 'center',
    marginVertical: 20,
  },

  searchContainer: {
    fontFamily: 'Mohave',
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

  // a note
  noteItem: {
    fontFamily: 'Mohave',
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

  // NOTE STUFF
  // note title
  noteTitle: {
    fontFamily: 'Mohave',
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    width: "auto",
    maxHeight: 23,
    overflow: "hidden",
  },

  // date
  noteDate: {
    fontFamily: 'Mohave',
    fontSize: 14,
    color: '#888',
    minWidth: 70,
  },

  // preview
  notePreview: {
    fontSize: 14,
    color: '#555',
    paddingLeft: 20,
    maxWidth: '80%',
    maxHeight: 23,
    textOverflow: "ellipsis",
    overflow: "hidden",
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
    fontSize: 40,
    height: 55,

  },
}); 