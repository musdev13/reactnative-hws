import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CityPage() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Вінниця</Text>

                    <Image
                        source={require("../assets/images/city.png")}
                        style={styles.image}
                    />

                    <Text style={styles.description}>
                        Вінниця — місто в центральній частині України,
                        адміністративний центр Вінницької області. Місто
                        відоме своїм фонтаном Roshen, затишними вулицями,
                        парками та мальовничими краєвидами Південного Бугу.
                    </Text>

                    <Link style={styles.buttonGoBack} href="/">
                        Go back to Home Page
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 14,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    description: {
        fontSize: 18,
        lineHeight: 28,
        marginBottom: 20,
    },
    buttonGoBack: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        color: "white",
        textAlign: "center",
    },
});
