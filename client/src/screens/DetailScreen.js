import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function DetailScreen({ navigation, route }) {
    const { external_id } = route.params;
    // const [id, setId] = useState(0);
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
            const data = response.data;
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const renderItem = ({ item }) => {
        console.log(item, "=================, ini di item");
        return (
            <View>
                <View>
                    <Text>
                        {item.name}
                    </Text>
                </View>
                <View>
                    <Image
                        style={styles.image}
                        source={{
                            uri: item.image_url
                        }} />
                </View>
            </View>
        );
    };

    useEffect(() => {
        const id = checkExternalId(external_id);
        console.log(id);
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
                    <FlatList
                        data={collection}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                </View>}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    textDetail: {
        color: "black"
    },
    image: {
        width: 150,
        height: 150,
    },
});