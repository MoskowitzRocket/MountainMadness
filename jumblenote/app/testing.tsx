import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  // We'll add a new component for additional practice
  Switch,
} from "react-native";

export default function TaskManager() {
  // TODO: Define your state variables here
  const [tasks, setTasks] = useState<Array<{id: number, title: string, description: string, completed: boolean}>>([]);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // TODO: Create function to add/edit a task
  const handleAddTask = () => {
    setIsModalVisible(true);
  };
  // TODO: Create function to handle task editing
  
  // TODO: Create function to delete a task
  
  // TODO: Create function to toggle task completion
  
  return (
    <View style={styles.container}>
      {/* App title */}
      <Text style={styles.title}>My Tasks</Text>
      
      {/* Task list will go here */}
      <ScrollView style={styles.taskList}>
        {/* TODO: Map through tasks and render them */}
      </ScrollView>
      
      {/* Add Task button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // TODO: Implement this
        }}
      >
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
      
      {/* Task modal will go here */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  taskList: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // TODO: Add more styles as needed
});