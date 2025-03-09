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
import SketchCanvas from "@/components/drawing/SketchCanvas";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState("");
  const isNewNote = id === 'new';

  useEffect(() => {
    const loadNote = async () => {
      if (!isNewNote) {
        try {
          const noteData = await getNoteById(id as string);
          if (noteData) {
            setTitle(noteData.title);
            setContent(noteData.content);
            setDrawing(noteData.drawing || "");
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

    try {
      if (isNewNote) {
        await saveNote({ title, content, drawing });
      } else {
        await updateNote({
          id: id as string,
          title,
          content,
          drawing,
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.content}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Note title"
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Start typing your note..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>Draw something: </Text>
          <View style={styles.drawingContainer}>
            <SketchCanvas savedDrawing={drawing} onSaveDrawing={setDrawing}/>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    width: "auto",
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
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
    marginBottom: 16,
    padding: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
    minHeight: 300,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  drawingContainer: {
    height: 300, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
}); 