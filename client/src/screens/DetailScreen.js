import { StyleSheet, View, Text } from 'react-native';


export default function DetailScreen({ navigation, route }) {
    const { id } = route.params;
    return (
        <View style={styles.container}>
            <Text>Detail Screen Id : {id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    }
});