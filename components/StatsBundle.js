import { View, Text, StyleSheet } from 'react-native';
import OneDayStats from './OneDayStats';
import { Color } from "../GlobalStyles";

import { ThemeContext } from "../hooks/ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useState } from "react";

const StatsBundle = ({ even, month, day }) => {
    const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            height: 144,
            justifyContent: 'space-between',
            backgroundColor: chosenTheme.faintPrimary,
        },
        evenContainer: {
            backgroundColor: 'transparent',
        },
        textContainer: {
            alignItems: 'center',
            paddingHorizontal: 16,
        },
        dateText: {
            color: chosenTheme.primary,
            fontWeight: 'bold',
            fontSize: 15,
            width: 30,
            // borderWidth: 1,
            // borderColor: 'black',
            textAlign: 'center',
        },
        taskContainer: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            marginRight: 0,
        },
    })
  };

  const styles = getStyles();  

    return (
        <View style={[styles.container, even ? styles.evenContainer : null]}>
            <View style={styles.textContainer}>
                <Text style={styles.dateText}>{month}</Text>
                <Text style={styles.dateText}>{day}</Text>
            </View>
            <View style={styles.taskContainer}>
                <OneDayStats taskStatus="completed" />
                <OneDayStats taskStatus="failed" />
                <OneDayStats taskStatus="inprogress" />
            </View>
        </View>
    );
};

export default StatsBundle;
