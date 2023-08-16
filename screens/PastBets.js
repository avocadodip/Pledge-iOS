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
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query, 
  startAfter,
  where,
} from "firebase/firestore";
import { useSettings } from "../hooks/SettingsContext";

const PastBets = ({ navigation }) => {
  const { theme, backgroundGradient } = useThemes();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDay, setLastDay] = useState(null);
  const { currentUserID } = useSettings();
  const [allDataFetched, setAllDataFetched] = useState(false);

  const fetchData = async () => {

    if (loading || allDataFetched) {
      console.log("returned");
      return; 
    }
    setLoading(true);

    console.log("running");

    console.log(currentUserID);

    try {

      let q = query(
        collection(doc(db, "users", currentUserID), "todos"),
        orderBy("date", "desc"),
        limit(10)
      );

      if (lastDay) {
        q = query(q, startAfter(lastDay));
      }

      const querySnapshot = await getDocs(q);

      // No more todos left
      if (querySnapshot.empty) {
        console.log("No more data to fetch.");
        setAllDataFetched(true);
        return;
      }

      const todos = [];
      querySnapshot.forEach((dayDoc) => {
        const dayData = dayDoc.data();

        if (dayData.todos) {
          todos.push(...dayData.todos.slice(0, 3));
        }
      });

      if (querySnapshot.docs.length > 0) {
        setLastDay(
          querySnapshot.docs[querySnapshot.docs.length - 1].data().date
        );
      }

      setData((prevData) => [...prevData, ...todos]);
    } catch (error) {
      console.error("An error occurred while fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserID) {

      fetchData();
    }
  }, [currentUserID]);

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
          keyExtractor={(item, index) => index.toString()}
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
