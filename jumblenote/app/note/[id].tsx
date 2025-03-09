import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
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
  const [contentHeight, setContentHeight] = useState(38);
  const [isEdited, setIsEdited] = useState(false);
  const isNewNote = id === 'new';

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

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!isEdited)
    {
      return;
    }

    try {
      if (isNewNote) {
        await saveNote({ title, content });
      } else {
        await updateNote({
          id: id as string,
          title,
          content,
          date: new Date().toISOString()
        });
      }
      router.back();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={async () => {
          if (title.trim() || content.trim()) {
            try {
              if (isNewNote) {
                await saveNote({ title: title || "Untitled", content });
              } else {
                await updateNote({
                  id: id as string,
                  title: title || "Untitled",
                  content,
                  date: new Date().toISOString()
                });
              }
            } catch (error) {
              console.error("Error saving note:", error);
            }
          }
          router.back();
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
          }
          placeholder="Start typing your note..."
          placeholderTextColor="#999"
          multiline

          textAlignVertical="top"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
    width: "100%",
    borderWidth: 0,
    borderColor: "transparent",
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: "top", // Ensures text starts at the top
  },
}); 