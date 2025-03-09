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
  Animated,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { loadNotes, Note } from "../utils/notesStorage";

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [JumboUp] = useState(new Animated.Value(0)); // position for bird1
  const [JumboDown] = useState(new Animated.Value(100)); // position for bird2

  //////////////////////////////////////////////////////////////////////////////////////
  // flying jumbo
  const flyjumbofly = () => {
    // Loop between images by animating opacity
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(JumboUp, { toValue: 1, duration: 600, useNativeDriver: true }), // show 1
          Animated.timing(JumboDown, { toValue: 0, duration: 0, useNativeDriver: true }), // hide 2
        ]),
        Animated.parallel([
          Animated.timing(JumboUp, { toValue: 0, duration: 0, useNativeDriver: true }), // show 2
          Animated.timing(JumboDown, { toValue: 1, duration: 600, useNativeDriver: true }), // hide 1
        ]),
      ])
    ).start();
  };

  //////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Display splash screen for at least 1 second
        await new Promise(resolve => setTimeout(resolve, 5000));
        const storedNotes = await loadNotes();
        setNotes(storedNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
    flyjumbofly();

  }, []);
  //////////////////////////////////////////////////////////////////////////////////////
  useFocusEffect(
    useCallback(() => {
      const loadAllNotes = async () => {
        const storedNotes = await loadNotes();
        setNotes(storedNotes);
      };

      loadAllNotes();
    }, [])
  );


  //////////////////////////////////////////////////////////////////////////////////////
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  //////////////////////////////////////////////////////////////////////////////////////
  // format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  //////////////////////////////////////////////////////////////////////////////////////
  // show date preview
  const getPreview = (content: string) => {
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  };
  //////////////////////////////////////////////////////////////////////////////////////

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("../assets/images/slogan2.png")}
          style={{ width: 335, height: 160 }}
        />
        {/***************************************** FLY, JUMBO, FLY! *****************************************/}

        <View style={styles.jumboup}>
          <Animated.Image
            source={require("../assets/images/jumbofly1.png")} // jumbo up
            style={[styles.birdImage, { opacity: JumboUp },]}
          />

        </View>

        <View style={styles.jumbodown}>
          <Animated.Image
            source={require("../assets/images/jumbofly2.png")} // jumbo down
            style={[styles.birdImage, { opacity: JumboDown },]}
          />
        </View>
      </View>


    );
  }
  //////////////////////////////////////////////////////////////////////////////////////
  // main page
  return (

    <View style={styles.container}>
      {/* logo */}
      <View style={styles.centercontainer}>
        <Image
          source={require("../assets/images/name2.png")}
          style={{ width: 240, height: 90, marginTop: 45, marginLeft: 45, marginRight: 45 }}
        />
      </View>

      {/***************************************** SEARCH BAR  *****************************************/}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a note..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/***************************************** LIST OF NOTES  *****************************************/}
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
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
                  <Text style={styles.notePreview}>{getPreview(note.content)}</Text>
                </View>

              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

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
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20
  },

  centercontainer: {
    alignItems: 'center'
  },

  // Main app styles
  container: {
    fontFamily: 'Mohave',
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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

  // **************************************************************************
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
    fontSize: 14,
    color: "#888",
    marginRight: 10, // Spacing between date and preview
    flexShrink: 0, // Prevents shrinking
  },

  notePreview: {
    fontSize: 14,
    color: "#555",
    flexShrink: 1,
    maxWidth: '80%',
    maxHeight: 23,
    overflow: "hidden",
  },
  // **************************************************************************

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
  emptyMessage: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },

  jumboup: {
    position: "absolute",
    top: 620,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  jumbodown: {
    position: "absolute",
    top: 670,
    left: 0,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  birdImage: {
    width: 100,
    height: 100,
    position: "absolute",
    zIndex: 10,
  },
}); 