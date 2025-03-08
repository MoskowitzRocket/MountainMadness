import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  useEffect(() => {
    if (id !== 'new') {
      setTitle(`Note #${id}`);
      setContent(`This is the content for note ${id}`);
    }
  }, [id]);
  
  const handleSave = () => {
    console.log('Saving note:', { id, title, content });
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.pageTitle}>{id === 'new' ? 'New Note' : title}</Text>
      
      <TextInput 
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Note title"
      />
      
      <TextInput
        style={styles.contentInput}
        multiline
        value={content}
        onChangeText={setContent}
        placeholder="Start typing..."
      />
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    fontSize: 16,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 18,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  contentInput: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: "top",
    minHeight: 200,
  },
  saveButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
}); 