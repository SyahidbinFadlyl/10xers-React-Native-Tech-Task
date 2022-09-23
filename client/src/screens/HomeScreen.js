import { StyleSheet, View, Text, FlatList, SafeAreaView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomeScreen() {
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);

    async function fetchData() {
        try {
            const obj = {};
            const filterdCollection = [];
            const { data } = await axios.get("https://api-generator.retool.com/jlEsLB/wallet_content");
            const collections = data.map(e => {
                return JSON.parse(e.collection_json);
            });
            collections.forEach(el => {
                if (!obj[el.name]) {
                    obj[el.name] = el;
                    obj[el.name].NumberOfOwnedTokens = 1;
                } else {
                    obj[el.name].NumberOfOwnedTokens = obj[el.name].NumberOfOwnedTokens + 1;
                }
            });
            for (const property in obj) {
                filterdCollection.push(obj[property]);
            }
            console.log(filterdCollection);
            setCollections(filterdCollection);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
                <Image
                    style={styles.image}
                    source={{
                        uri: item.image_url
                    }} />
                <Text style={styles.ColName}>{item.name}</Text>
                <Text style={styles.ColName}>Number of owned tokens : {item.NumberOfOwnedTokens}</Text>

            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View >
                <FlatList
                    data={collections}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    image: {
        width: 150,
        height: 150,
    },
    ColName: {
        color: "black"
    },
    listItem: {
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});