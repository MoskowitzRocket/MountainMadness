import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Image
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getNoteById, saveNote, updateNote, deleteNote } from '../../utils/notesStorage';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [titleHeight, setTitleHeight] = useState(50); // Initial height
  const [isEdited, setIsEdited] = useState(false);
  const isNewNote = id === 'new';

  const [JumboUp] = useState(new Animated.Value(0)); // position for bird1
  const [JumboDown] = useState(new Animated.Value(100)); // position for bird2

  const [savingNote, setSavingNote] = useState(false);

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

  useEffect(() => {
    const loadNote = async () => {
      if (!isNewNote) {
        try {
          const noteData = await getNoteById(id as string);
          if (noteData) {
            setTitle(noteData.title);
            setContent(noteData.content);
          } else {
            Alert.alert('Error', 'Note not found');
            router.back();
          }
        } catch (error) {
          console.error('Error loading note:', error);
          Alert.alert('Error', 'Failed to load note');
        }
      }
      setLoading(false);
    };

    loadNote();
  }, [id, isNewNote]);

  const handleDelete = async () => {
    if (isNewNote) {
      router.back();
      return;
    }

    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(id as string);
              router.back();
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      {savingNote ? (
        <View style={styles.splashContainer}>
          <Image
            source={require("../../assets/images/slogan2.png")}
            style={{ width: 335, height: 160 }}
          />
          <View style={styles.jumboup}>
            <Animated.Image
              source={require("../../assets/images/jumbofly1.png")}
              style={[styles.birdImage, { opacity: JumboUp }]}
            />
          </View>
          <View style={styles.jumbodown}>
            <Animated.Image
              source={require("../../assets/images/jumbofly2.png")}
              style={[styles.birdImage, { opacity: JumboDown }]}
            />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {
              setSavingNote(true);
              flyjumbofly();
              setTimeout(() => {
                router.back();
              }, 3000);
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#F40125' }}>{"\<"} </Text>
                <Text style={styles.backButton}>Back</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content}>
            <TextInput
              style={[styles.titleInput, { height: titleHeight }]}
              onContentSizeChange={(event) =>
                setTitleHeight(event.nativeEvent.contentSize.height)
              }
              scrollEnabled={false}
              value={title}
              onChangeText={setTitle}
              placeholder="Note title"
              multiline
              placeholderTextColor="#999"

            />

            <TextInput
              style={[styles.contentInput, { height: contentHeight }]}
              onContentSizeChange={(event) =>
                setContentHeight(event.nativeEvent.contentSize.height)
              }
              selectionColor='transparent'
              value={content}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={(text) => {
                setContent(text)
                setIsEdited(true)
              }}
              placeholder="Start typing your note..."
              placeholderTextColor="#999"
              multiline

              textAlignVertical="top"
            />
          </ScrollView>
        </View>
      )}
    </>
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
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#ffffff",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    width: "auto",
  },
  backButton: {
    fontSize: 16,
    color: '#FFC805',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  saveButton: {
    marginRight: 15,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {},
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  content: {
    flex: 1,
    flexGrow: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    width: "100%",
    borderWidth: 0,
    borderColor: "transparent",
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: "top", // Ensures text starts at the top
  },
  contentInput: {
    flexGrow: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 80,
    padding: 8,
    width: "100%",
    borderWidth: 0,
    borderColor: "transparent",
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: "top",
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
    }
}); 