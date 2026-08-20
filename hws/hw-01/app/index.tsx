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

                <Text style={styles.title}>Моя домашня робота</Text>
                <Text style={styles.subtitle}>React Native · Модуль 1</Text>

                <Link href="/city" style={styles.button}>
                    <Text style={styles.buttonText}>🏙️ Моє місто</Text>
                </Link>

                <Link href="/about" style={styles.buttonSecondary}>
                    <Text style={styles.buttonSecondaryText}>👤 Про мене</Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F4F7FB",
    },
    container: {
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: 28,
        borderRadius: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#172033",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#64748B",
        marginBottom: 32,
    },
    button: {
        width: "100%",
        backgroundColor: "#2563EB",
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
    },
    buttonSecondary: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2563EB",
        alignItems: "center",
    },
    buttonSecondaryText: {
        color: "#2563EB",
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
    },
});
