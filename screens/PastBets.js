import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Color,
  SETTINGS_HORIZONTAL_PADDING,
  settingsPageStyles,
} from "../GlobalStyles";
import SettingsHeader from "../components/settings/SettingsHeader";
import StatsItem from "../components/stats/StatsItem";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "../database/firebase";
import { collection, doc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { useSettings } from "../hooks/SettingsContext";

const PastBets = ({ navigation }) => {
  const { theme, backgroundGradient } = useThemes();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const { currentUserID } = useSettings();


  const fetchData = async () => {
    setLoading(true);

    // Define the base query
    let q = query(
      collection(doc(db, "users", currentUserID), "todos"),
      orderBy("createdAt", "desc"),
      // Limit the results to a specific number per page
      limit(10)
    );

    // If there is a last document, start the query after that document
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Extract the todos and update the state
    const todos = [];
    querySnapshot.forEach((dayDoc) => {
      const dayData = dayDoc.data();
      if (dayData.todos) {
        todos.push(...dayData.todos);
      }
    });

    // Set the last document for pagination
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

    // Update the state with the new todos
    setData([...data, ...todos]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMore = () => {
    fetchData();
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ color: "#000" }} />;
  };

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={style.pageContainer}>
        <SettingsHeader navigation={navigation} header={"Past Bets"} />
        <FlatList
          data={data}
          renderItem={({ item }) => <StatsItem title={item.title} />}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PastBets;

const style = StyleSheet.create({
  pageContainer: {
    display: "flex",
    marginHorizontal: SETTINGS_HORIZONTAL_PADDING,
  },
});
