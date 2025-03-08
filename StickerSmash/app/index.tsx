import { Text, View,  StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Button from '@/components/Button';


export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About Screen
      </Link>
      <Button label="Press me" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button : {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: 'fff',
  },
});
