import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, GestureResponderEvent, Dimensions } from "react-native";
import { Svg, Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("screen");

interface SketchCanvasProps {
    savedDrawing?: string;
    onSaveDrawing: (drawing: string) => void;
}

export default function DrawingCanvas({savedDrawing, onSaveDrawing}: SketchCanvasProps) {
    const [paths, setPaths] = useState<string[][]>([]); // Stores all drawn paths
    const [currentPath, setCurrentPath] = useState<string[]>([]); // Stores ongoing drawing
  
    useEffect(() => {
        const loadDrawing = async () => {
          try {
            if (!savedDrawing) {
              setPaths([]);
              return;
            }
            const parsedDrawing = JSON.parse(savedDrawing);
            if (Array.isArray(parsedDrawing)) {
              setPaths(parsedDrawing);
            }
          } catch (error) {
            console.error("Failed to load drawing:", error);
          }
        };
      
        loadDrawing();
      }, [savedDrawing]); // Runs when savedDrawing changes
  
    // Handles touch movement
    const onTouchMove = (event: GestureResponderEvent) => {
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = `${currentPath.length === 0 ? "M" : "L"}${locationX.toFixed(0)},${locationY.toFixed(0)}`;
        
        setCurrentPath((prev) => [...prev, newPoint]);
    };

  // When the user lifts their finger, save the path
    const onTouchEnd = () => {
    if (currentPath.length > 0) {
        setPaths((prevPaths) => [...prevPaths, currentPath]);
        AsyncStorage.setItem("savedDrawing", JSON.stringify([...paths, currentPath])).catch((error) =>
            console.error("Error saving drawing:", error));
        onSaveDrawing(JSON.stringify([...paths, currentPath]));
        setCurrentPath([]); 
    }
    };

  // Clear the canvas
    const clearCanvas = async () => {
        setPaths([]);
        await AsyncStorage.removeItem("savedDrawing");
        onSaveDrawing("");
    };

    return (
        <SafeAreaView style={styles.container}> 
        <ScrollView contentContainerStyle={styles.scrollView} scrollEnabled={false}>
            <View style={styles.canvasWrapper} pointerEvents="box-none">
            <View 
                style={styles.canvas} 
                onTouchMove={onTouchMove} 
                onTouchEnd={onTouchEnd}
            >
                <Svg width={width} height={height}>
                {paths.map((path, index) => (
                    <Path
                    key={`path-${index}`} 
                    d={path.join(" ")}
                    stroke="black"
                    fill="transparent"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    />
                ))}
                {currentPath.length > 0 && (
                    <Path
                    d={currentPath.join(" ")}
                    stroke="red"
                    fill="transparent"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    />
                )}
                </Svg>
            </View>
            </View>
        </ScrollView>

        <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
            <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
  },
  canvasWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    width: width,
    height: height,
    backgroundColor: "white",
  },
  clearButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  clearButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
