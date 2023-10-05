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
import { getBeginningOfWeekDate } from "../utils/currentDate";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({ isOnboarded: false });
  const [currentUserID, setCurrentUserID] = useState(null);
  const [currentUserFullName, setCurrentUserFullName] = useState(null);
  const [currentUserFirstName, setCurrentUserFirstName] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [appReadyToRender, setAppReadyToRender] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  // Past bets data fetching:
  const [pastBetsArray, setPastBetsArray] = useState([]);
  const [fetchingPastBets, setFetchingPastBets] = useState(false);
  const [lastPastBetsDay, setLastPastBetsDay] = useState([]);
  const [lastTransactionsDay, setLastTransactionsDay] = useState([]);
  const [allPastBetsDataFetched, setAllPastBetsDataFetched] = useState(false);
  // Fetching transactions:
  const [transactionsArray, setTransactionsArray] = useState([]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);
  const [allTransactionsDataFetched, setAllTransactionsDataFetched] =
    useState(false);
  const [
    hasFetchedMostRecentTransactionsDoc,
    setHasFetchedMostRecentTransactionsDoc,
  ] = useState(false);

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

        setAllPastBetsDataFetched(false);
        setAllTransactionsDataFetched(false);
        setPastBetsArray([]);
        setTransactionsArray([]);
        setLastPastBetsDay([]);
        setLastTransactionsDay([]);
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
            setCurrentUserFirstName(userSettings.fullName.split(" ")[0]);
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
    if (allPastBetsDataFetched || fetchingPastBets) {
      return;
    }

    setFetchingPastBets(true);

    try {
      const q = query(
        collection(doc(db, "users", currentUserID), "todos"),
        orderBy("date", "desc"),
        limit(10),
        lastPastBetsDay ? startAfter(lastPastBetsDay) : undefined // startAfter if lastDay exists
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
        setLastPastBetsDay(
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

  const fetchTransactions = async () => {
    if (allTransactionsDataFetched || fetchingTransactions) {
      return;
    }

    setFetchingTransactions(true);

    try {
      const q1 = query(
        collection(doc(db, "users", currentUserID), "fines"),
        where("isCharged", "==", true),
        orderBy("id", "desc"),
        limit(10),
        lastTransactionsDay ? startAfter(lastTransactionsDay) : undefined
      );

      const querySnapshot1 = await getDocs(q1);

      // No more fines left
      if (querySnapshot1.empty) {
        console.log("No more data to fetch.");
        setAllTransactionsDataFetched(true);
        return;
      }

      let finesArray = [...querySnapshot1.docs.map((doc) => doc.data())];

      // also get most recent doc (isCharged may == false) only if it hasn't been fetched before
      if (!hasFetchedMostRecentTransactionsDoc) {
        const q2 = query(
          collection(doc(db, "users", currentUserID), "fines"),
          orderBy("id", "desc"),
          limit(1)
        );

        const querySnapshot2 = await getDocs(q2);

        // Add the most recent doc if isCharged == false and fined tasks exist
        const mostRecentDoc = querySnapshot2.docs[0].data();
        if (
          mostRecentDoc.isCharged === false &&
          mostRecentDoc.finedTasks &&
          mostRecentDoc.finedTasks.length > 0
        ) {
          finesArray.push(mostRecentDoc);
        }

        setHasFetchedMostRecentTransactionsDoc(true);
      }

      // Set last day
      if (querySnapshot1.docs.length > 0) {
        setLastTransactionsDay(
          querySnapshot1.docs[querySnapshot1.docs.length - 1].data().id
        );
      }

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

  const formatWeeksList = (weeksList) => {
    // Upcoming if it's this week's doc
    const upcoming = weeksList.filter((week) => {
      return week.id === getBeginningOfWeekDate();
    });

    // Else it's prior
    const pastCharges = weeksList.filter((week) => {
      return week.id !== getBeginningOfWeekDate();
    });

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

  return (
    <SettingsContext.Provider
      value={{
        settings,
        currentUserID,
        setCurrentUserID,
        currentUserFullName,
        setCurrentUserFullName,
        currentUserFirstName,
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
