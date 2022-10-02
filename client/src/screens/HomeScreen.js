import { StyleSheet, View, Text, FlatList, SafeAreaView, Image, TouchableHighlight, Dimensions, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function HomeScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);
    const image = { uri: "https://api.time.com/wp-content/uploads/2021/03/nft-art-1.jpg?quality=85&w=1600" };
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
            setCollections(filterdCollection);
            setLoading(false);
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
                <TouchableHighlight onPress={() => {
                    navigation.navigate("Detail", { external_id: item.external_id, NumberOfOwnedTokens: item.NumberOfOwnedTokens });
                }}>
                    <Image
                        style={styles.image}
                        source={{
                            uri: item.image_url
                        }} />
                </TouchableHighlight>

                <Text style={styles.ColName}>{item.name}</Text>
                <Text style={styles.numberOfOwnded}>Number of owned tokens :  {item.NumberOfOwnedTokens}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover">
                {loading && <Text style={{ color: "black" }}>Loading..</Text>}
                {!loading &&
                    <View style={styles.containerList} >
                        <FlatList
                            data={collections}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />
                    </View>}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 150,
        height: 150,
    },
    ColName: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 5
    },
    listItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        backgroundColor: 'rgba(10, 10, 10, .9)',
        padding: 50,
        borderRadius: 20
    },
    numberOfOwnded: {
        color: "white",
        fontWeight: "600",
        marginTop: 5,

    },
    containerList: {
        alignItems: 'center',
        justifyContent: 'center',

        paddingTop: 30,
        width: screenWidth
    }
});