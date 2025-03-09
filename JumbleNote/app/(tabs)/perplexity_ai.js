import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
//import { getConfig } from 'react-native-config';

export default function PerPlexity() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.API_KEY;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: "Be precise and concise." },
        { role: "user", content: input },
      ],
      max_tokens: 123,
      temperature: 0.2,
      top_p: 0.9,
      search_domain_filter: null,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "",
      top_k: 0,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
      response_format: null
    }),
  };

  const fetchPerplexityResponse = async () => {
    setLoading(true);  // Start the loading process

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', options);
      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (err) {
      console.error('Error fetching response:', err);
      setResponse('Failed to fetch response.');
    } finally {
      setLoading(false);  // Stop the loading process once done
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ask a question"
        value={input}
        onChangeText={setInput}
      />
      
      <Button title="Ask Perplexity" onPress={fetchPerplexityResponse} />
      
      {loading ? (
        // Display ActivityIndicator while loading
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <Text style={styles.response}>{response}</Text>
      )}
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
  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: '#fff',
    padding: 10,
    marginBottom: 10,
  },
  response: {
    color: '#fff',
    marginTop: 10,
  },
});
