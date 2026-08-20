import { Image, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image
                    source={require("../assets/images/icon.png")}
                    style={styles.image}
                />

                <Text style={styles.title}>Home Page</Text>

                <Link style={styles.button} href="/city">
                    Go to My City
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        color: "white",
    },
});
