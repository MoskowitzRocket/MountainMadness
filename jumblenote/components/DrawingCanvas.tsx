// import React, { useState, useEffect } from "react";
// import { View, Button, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   Gesture,
//   GestureDetector,
//   GestureHandlerRootView,
// } from "react-native-gesture-handler";
// import { Canvas, Path, Skia } from "@shopify/react-native-skia";

// interface DrawingCanvasProps {
//   savedDrawing: string; // ✅ Load saved drawings (if any)
//   onSaveDrawing: (drawing: string) => void; // ✅ Save drawings to parent component
// }

// export default function DrawingCanvas({ savedDrawing, onSaveDrawing }: DrawingCanvasProps) {
//   const [paths, setPaths] = useState<string[]>(savedDrawing ? savedDrawing.split("|") : []);

//   useEffect(() => {
//     onSaveDrawing(paths.join("|")); // ✅ Save drawing whenever it updates
//   }, [paths]);

//   const pan = Gesture.Pan()
//     .onStart((g) => {
//       setPaths((prevPaths) => [...prevPaths, `M ${g.x} ${g.y}`]);
//     })
//     .onUpdate((g) => {
//       const updatedPaths = [...paths];
//       updatedPaths[updatedPaths.length - 1] += ` L ${g.x} ${g.y}`;
//       setPaths(updatedPaths);
//     })
//     .minDistance(1);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <GestureDetector gesture={pan}>
//         <View style={styles.container}>
//           <Canvas style={styles.canvas}>
//             {paths.map((d, index) => (
//               <Path key={index} path={Skia.Path.MakeFromSVGString(d)} strokeWidth={5} style="stroke" color="#06d6a0" />
//             ))}
//           </Canvas>
//           <Button title="Clear" onPress={() => setPaths([])} />
//         </View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   canvas: {
//     flex: 1,
//   },
// });
