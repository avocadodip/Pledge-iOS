import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../database/firebase";
import { onAuthStateChanged } from "@firebase/auth";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({ isOnboarded: false });
  const [currentUserID, setCurrentUserID] = useState(null);
  const [currentUserFullName, setCurrentUserFullName] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [appReadyToRender, setAppReadyToRender] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  // Past bets data fetching:
  const [pastBetsArray, setPastBetsArray] = useState([]);
  const [fetchingPastBets, setFetchingPastBets] = useState(false);
  const [lastDay, setLastDay] = useState([]);
  const [allPastBetsDataFetched, setAllPastBetsDataFetched] = useState(false);
  // Fetching transactions:
  const [transactionsArray, setTransactionsArray] = useState([]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);
  const [allTransactionsDataFetched, setAllTransactionsDataFetched] =
    useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setCurrentUserID(user.uid);
        setIsAuthenticated(true); // user is authenticated
      } else {
        setCurrentUserID(null);
        setIsAuthenticated(false); // user is not authenticated
        setUserDataFetched(false);
        setAppReadyToRender(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUserID) {
      const userDoc = doc(db, "users", currentUserID);

      const unsubscribe = onSnapshot(
        userDoc,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userSettings = docSnapshot.data();
            setSettings(userSettings);
            setCurrentUserFullName(userSettings.fullName);
            setCurrentUserEmail(userSettings.email);
            setUserDataFetched(true);
          } else {
            // Handle the case where the user does not exist or has no settings
          }
          // setLoading(false); // turn off loading
        },
        (error) => {
          console.error("Error fetching user settings: ", error);
        }
      );

      // Clean up listener when component is unmounted or userID changes
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  // Past Bets data fetching (to prevent fetching data every time)
  const fetchPastBets = async () => {
    if (fetchingPastBets || allPastBetsDataFetched) {
      return;
    }

    setFetchingPastBets(true);

    try {
      const q = query(
        collection(doc(db, "users", currentUserID), "todos"),
        orderBy("date", "desc"),
        limit(10),
        lastDay ? startAfter(lastDay) : undefined // startAfter if lastDay exists
      );

      const querySnapshot = await getDocs(q);

      // No more todos left
      if (querySnapshot.empty) {
        console.log("No more data to fetch.");
        setAllPastBetsDataFetched(true);
        return;
      }

      // Push days into array
      const daysArray = [];
      querySnapshot.forEach((dayDoc) => {
        daysArray.push(dayDoc.data());
      });

      // Set last day
      if (querySnapshot.docs.length > 0) {
        setLastDay(
          querySnapshot.docs[querySnapshot.docs.length - 1].data().date
        );
      }

      // Append to data state
      setPastBetsArray((prevData) => [...prevData, ...daysArray]);
    } catch (error) {
      console.error("An error occurred while fetching todos:", error);
    } finally {
      setFetchingPastBets(false);
    }
  };

  // Fetching weeks:
  const formatWeekID = (weekID) => {
    const year = weekID.slice(0, 4);
    const month = weekID.slice(4, 6);
    const dayStart = weekID.slice(6, 8);
    const dayEnd = weekID.slice(9, 11);
    return `${parseInt(month)}/${parseInt(dayStart)}/${year} - ${parseInt(
      month
    )}/${parseInt(dayEnd)}/${year}`;
  };

  const formatWeeksList = (weeksList) => {
    console.log("!");
    console.log(weeksList);
    // Format the data as needed for your SectionList
    const upcoming = weeksList.filter((week) => week.isCharged === false);
    const pastCharges = weeksList.filter((week) => week.isCharged === true);

    return [
      {
        title: "Upcoming",
        data: upcoming,
      },
      {
        title: "Past Charges",
        data: pastCharges,
      },
    ];
  };

  const fetchTransactions = async () => {
    setFetchingTransactions(true);

    try {
      const q = query(
        collection(doc(db, "users", currentUserID), "fines"),
        where("isCharged", "==", true),
        orderBy("id", "desc"),
        limit(10),
        lastDay ? startAfter(lastDay) : undefined // startAfter if lastDay exists
      );

      const querySnapshot = await getDocs(q);

      // No more todos left
      if (querySnapshot.empty) {
        console.log("No more data to fetch.");
        setAllTransactionsDataFetched(true);
        return;
      }

      // Push days into array
      const finesArray = [];
      querySnapshot.forEach((weekDoc) => {
        finesArray.push(weekDoc.data());
      });

      // Set last day
      if (querySnapshot.docs.length > 0) {
        setLastDay(querySnapshot.docs[querySnapshot.docs.length - 1].data().id);
      }

      console.log("Raw Weeks Data:", finesArray); // Log the raw data here
      // Append to existing data state
      setTransactionsArray((prevData) => {
        // Concatenate old and new data
        const combinedData = [...prevData, ...finesArray];

        // Apply the formatWeeksList function on the combined data
        return formatWeeksList(combinedData);
      });
    } catch (error) {
      console.error("An error occurred while fetching todos:", error);
    } finally {
      setFetchingTransactions(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        currentUserID,
        setCurrentUserID,
        currentUserFullName,
        setCurrentUserFullName,
        currentUserEmail,
        setCurrentUserEmail,
        isAuthenticated,
        userDataFetched,
        setUserDataFetched,
        appReadyToRender,
        setAppReadyToRender,
        fetchPastBets,
        pastBetsArray,
        fetchingPastBets,
        transactionsArray,
        fetchingTransactions,
        fetchTransactions,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
