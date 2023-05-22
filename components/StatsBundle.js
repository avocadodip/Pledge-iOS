import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OneDayStats from './OneDayStats';
import { Color } from "../GlobalStyles";

const StatsBundle = ({ even, month, day }) => {
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

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 144,
        justifyContent: 'space-between',
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    evenContainer: {
        backgroundColor: 'transparent',
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    dateText: {
        color: 'white',
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
});

export default StatsBundle;
