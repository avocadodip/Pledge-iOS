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
import { getBeginningOfWeekDate, getTimeStatus } from "../utils/currentDate";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({ isOnboarded: false });
  const [currentUserID, setCurrentUserID] = useState(null);
  const [currentUserFirstName, setCurrentUserFirstName] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [todayPageLoaded, setTodayPageLoaded] = useState(false);
  const [finishSignup, setFinishSignup] = useState(false);
  // Past bets data fetching:
  const [dreamsArray, setDreamsArray] = useState([]);
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
  const [todayItemsLeft, setTodayItemsLeft] = useState(0);
  const [tmrwItemsLeft, setTmrwItemsLeft] = useState(0);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [timeStatus, setTimeStatus] = useState(null);

  const resetStates = () => {
    setCurrentUserID(null);
    setIsAuthenticated(false);
    setUserDataFetched(false);
    setTodayPageLoaded(false);
    setAllPastBetsDataFetched(false);
    setAllTransactionsDataFetched(false);
    setPastBetsArray([]);
    setTransactionsArray([]);
    setLastPastBetsDay([]);
    setLastTransactionsDay([]);
    setDreamsArray([]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserID(user.uid);
        setIsAuthenticated(true);
      } else {
        resetStates();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // If user is authenticated, set settings states
    if (isAuthenticated && currentUserID) {
      const userDoc = doc(db, "users", currentUserID);

      const unsubscribe = onSnapshot(
        userDoc,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userSettings = docSnapshot.data();
            setSettings(userSettings);
            setCurrentUserFirstName(userSettings.firstName);
            setCurrentUserEmail(userSettings.email);
            setUserDataFetched(true);
            fetchDreams();
          } else {
            // Handle the case where the user has not finished sign up
            setFinishSignup(true);
            // navigation.navigate("FinishSignup");
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

  // Define startTimeStatusChecker function
  useEffect(() => {
    let timer;
    if (isAuthenticated && userDataFetched) {
      const { todayDayStart, todayDayEnd } = settings;

      timer = setInterval(() => {
        setTimeStatus(getTimeStatus(todayDayStart, todayDayEnd));
        setFinishSignup(false);

        setTodayPageLoaded(true);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isAuthenticated, userDataFetched]);

  // ----------------------- NON AUTH-RELATED: -----------------------

  // Fetch Dreams
  const fetchDreams = async () => {
    try {
      const q = query(
        collection(doc(db, "users", currentUserID), "dreams"),
        orderBy("lastCompleted", "desc"),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // No more todos left
        if (querySnapshot.empty) {
          console.log("No more data to fetch.");
          return;
        }

        // Push days into array
        const array = [];
        querySnapshot.forEach((dreamDoc) => {
          const data = dreamDoc.data();
          data.id = dreamDoc.id;
          array.push(data);
        });

        // Append to data state
        setDreamsArray(array);
      });

      // Clean up listener when component is unmounted or userID changes
      return () => unsubscribe();
    } catch (error) {
      console.error("An error occurred while fetching todos:", error);
    }
  };

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

  // 2. PAST CHARGES
  const fetchTransactions = async () => {
    if (allTransactionsDataFetched || fetchingTransactions) {
      return;
    }

    setFetchingTransactions(true);

    // Get all isCharged == true docs
    try {
      const q1 = query(
        collection(doc(db, "users", currentUserID), "fines"),
        where("isCharged", "==", true),
        orderBy("id", "desc"),
        limit(10),
        lastTransactionsDay ? startAfter(lastTransactionsDay) : undefined
      );

      const querySnapshot1 = await getDocs(q1);

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
          ((mostRecentDoc.finedTasks && mostRecentDoc.finedTasks.length > 0) ||
            mostRecentDoc.totalWeeklyFine > 0)
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

  // Checks if today page or tmrw page has been completed for the day
  useEffect(() => {
    const {
      todayTodos,
      tmrwTodos,
      todayIsActive,
      todayIsVacation,
      tmrwIsActive,
      tmrwIsVacation,
    } = settings;

    let todayCount = 0;
    let tmrwCount = 0;

    if (todayIsActive && !todayIsVacation) {
      todayCount =
        todayTodos?.filter((todo) => !todo.isComplete && todo.isLocked)
          .length || 0;
    }
    if (tmrwIsActive && !tmrwIsVacation) {
      tmrwCount = tmrwTodos?.filter((todo) => !todo.isLocked).length || 0;
    }

    setTodayItemsLeft(todayCount);
    setTmrwItemsLeft(tmrwCount);
    setDayCompleted(todayCount === 0 && tmrwCount === 0);
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        currentUserID,
        setCurrentUserID,
        currentUserFirstName,
        currentUserEmail,
        setCurrentUserEmail,
        isAuthenticated,
        userDataFetched,
        todayPageLoaded,
        finishSignup,
        setFinishSignup,

        fetchPastBets,
        pastBetsArray,
        fetchingPastBets,
        transactionsArray,
        fetchingTransactions,
        fetchTransactions,
        dreamsArray,

        todayItemsLeft,
        tmrwItemsLeft,
        dayCompleted,
        timeStatus,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
