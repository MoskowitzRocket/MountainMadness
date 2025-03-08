import { Text, View, StyleSheet} from "react-native";

export default function Index() {
  return (
    <View style={style.container}>
      <Text style={style.text}>I fuck with it</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252923",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  }
});
