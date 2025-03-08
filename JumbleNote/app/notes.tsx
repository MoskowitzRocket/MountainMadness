import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function Notes() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes</Text>
      {/* <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search notes"
        />
        <TouchableOpacity style={styles.sortButton}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.noteList}>
        <Text>Notes will go here</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>✎</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20
  },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20
    },
});