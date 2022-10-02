import { StyleSheet, View, Text, Image, FlatList, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import axios from 'axios';
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};


export default function DetailScreen({ navigation, route }) {
    const { external_id, NumberOfOwnedTokens } = route.params;
    const [collection, setCollection] = useState([]);
    const [loading, setLoading] = useState(true);

    const checkExternalId = (external_id) => {
        if (external_id === "68c7da87-5654-429f-86b2-543dfe5909a7") {
            return 1;
        } else if (external_id === "c754b953-b0ef-4070-b2f0-64e9ef243d10") {
            return 2;
        } else if (external_id === "15bded62-d223-4c87-96b3-e5a7215d5a08") {
            return 3;
        }
    };

    async function fetchDataDetail(id) {
        try {
            const response = await axios.get("https://api-generator.retool.com/j3Iz08/collections/" + id);
            const dataStatus = await axios.get("https://api-generator.retool.com/ELI42D/collection_stats?collection_id=" + id);
            const wallet = await axios.get("https://api-generator.retool.com/jlEsLB/wallet_content");
            const data = response.data;
            const collection_token = wallet.data.filter(e => JSON.parse(e.collection_json).external_id === data.external_id);
            data.collection_stats = dataStatus.data;
            data.collection_token = collection_token;
            floor_price_eth(data.collection_stats);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const timeStampDate = (data) => {
        const array = [];
        const time = [];
        time.forEach(element => {
            if (array.length <= 30) {
                array.push("");
            }
        });
        return array;
    };



    const floor_price_eth = (data) => {
        const array = [];
        const floor_price_eth = [];
        let item = data.reverse();
        if (item.length > 30) {
            item = item.reverse().slice(3);
        }
        item.forEach(e => {
            array.push(e.floor_price_eth);
        });
        return array;
    };

    const renderCollectionToken = ({ item }) => {
        return (
            <View style={styles.containerCollectionToken}>
                <View>
                    <Image
                        style={styles.imageCollectionToken}
                        source={{
                            uri: item.image_url
                        }} />
                    <Text style={styles.collectionTokenId}>#{item.token_id}</Text>
                </View>
            </View>
        );
    };

    const renderItem = ({ item }) => {
        return (
            <SafeAreaView style={styles.containerList}>
                <View >
                    <Image
                        style={styles.image}
                        source={{
                            uri: item.image_url
                        }} />
                </View>
                <View style={styles.container}>
                    <Text style={styles.nameCollectionItem}>
                        {item.name}
                    </Text>
                    <Text style={styles.numberOfOwned}>
                        Number of owned tokens : {NumberOfOwnedTokens}
                    </Text>
                    <Text style={styles.numberOfOwned}>
                        Total Volume : {item.total_volume}
                    </Text>
                    <Text style={styles.numberOfOwned}>
                        One day change : {item.one_day_change}
                    </Text>
                    <LineChart
                        style={styles.cart}
                        data={{
                            labels: timeStampDate(item.collection_stats),
                            datasets: [
                                {
                                    data: floor_price_eth(item.collection_stats),
                                    // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                                    // strokeWidth: 2 // optional
                                }
                            ],
                        }}
                        width={screenWidth}
                        height={256}
                        verticalLabelRotation={30}
                        chartConfig={chartConfig}
                        bezier
                    />
                    <View style={{ marginBottom: 100 }}>
                        <FlatList
                            data={item.collection_token}
                            renderItem={renderCollectionToken}
                            keyExtractor={(item) => item.external_id}
                        />
                    </View>
                </View>
                <View>
                </View>
            </SafeAreaView>
        );
    };

    useEffect(() => {
        const id = checkExternalId(external_id);
        fetchDataDetail(id).then(data => {
            setCollection([data]);
        }).finally(() => {
            setLoading(false);
        });
    }, [external_id]);
    return (
        <View style={styles.container}>
            {loading && <Text style={{ color: "black" }}>Loading..</Text>}
            {!loading &&
                <View >
                    <ImageBackground source={{ uri: collection[0].banner_image_url }} resizeMode="cover">
                        <FlatList
                            data={collection}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />

                    </ImageBackground>
                </View>}
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
        marginTop: 50,
        marginBottom: 20
    },
    banner: {
        width: screenWidth,
        height: screenHeight,
        opacity: 0.8,
        zIndex: -100
    },
    containerList: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#000000c0",
    },
    imageCollectionToken: {
        height: 300,
        width: 300,
        borderRadius: 20
    },
    nameCollectionItem: {
        fontSize: 40,
        fontWeight: "bold",
        color: "e7e5e5"
    },
    containerCollectionToken: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    collectionTokenId: {
        fontSize: 20,
        color: "e7e5e5",
        fontWeight: "bold",
        position: "absolute",
        bottom: 15,
        right: 15,
        backgroundColor: "grey",
        padding: 10,
        borderRadius: 10,
        opacity: 0.8,
    },
    cart: {
        marginTop: 30
    },
    numberOfOwned: {
        color: "e7e5e5",
        fontSize: 16,
        marginTop: 10,
        fontWeight: "700"
    }
});