import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const skills = [
    {
        id: "1",
        icon: "💻",
        title: "Програмування",
        description: "Розробка програм та вебзастосунків.",
    },
    {
        id: "2",
        icon: "🎨",
        title: "Дизайн",
        description: "Створення інтерфейсів та візуальних матеріалів.",
    },
    {
        id: "3",
        icon: "🎬",
        title: "Анімація та монтаж",
        description: "Створення анімацій та редагування відео.",
    },
    {
        id: "4",
        icon: "⚛️",
        title: "React Native",
        description: "Розробка мобільних застосунків.",
    },
];

export default function AboutPage() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.title}>Про мене</Text>

                    <Image
                        source={require("../assets/images/kotonak.jpg")}
                        style={styles.avatar}
                    />

                    <Text style={styles.name}>Богдан Андрун Бурмалдрунович</Text>

                    <Text style={styles.description}>
                        Мене цікавить програмування, дизайн та створення
                        цифрового контенту. У вільний час я займаюся
                        розробкою програм, анімацією та монтажем відео.
                        Я вирішив вивчати React Native, щоб створювати
                        мобільні застосунки за допомогою JavaScript та
                        React. Мені цікаво поєднувати програмування з
                        дизайном та створювати власні проєкти.
                    </Text>

                    <Text style={styles.sectionTitle}>
                        Мої навички та інтереси
                    </Text>

                    {skills.map((skill) => (
                        <View key={skill.id} style={styles.card}>
                            <Text style={styles.cardTitle}>
                                {skill.icon} {skill.title}
                            </Text>

                            <Text style={styles.cardDescription}>
                                {skill.description}
                            </Text>
                        </View>
                    ))}

                    <Link href="/" style={styles.button}>
                        <Text style={styles.buttonText}>
                            🏠 На головну
                        </Text>
                    </Link>

                    <Link href="/city" style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>
                            🏙️ Моє місто
                        </Text>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F4F7FB",
    },
    scrollContent: {
        paddingBottom: 30,
    },
    container: {
        padding: 20,
        alignItems: "center",
    },
    title: {
        width: "100%",
        fontSize: 32,
        fontWeight: "bold",
        color: "#172033",
        textAlign: "center",
        marginBottom: 24,
    },
    avatar: {
        width: 180,
        height: 180,
        borderRadius: 90,
        marginBottom: 18,
    },
    name: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2563EB",
        marginBottom: 20,
    },
    description: {
        width: "100%",
        fontSize: 17,
        lineHeight: 27,
        color: "#475569",
        marginBottom: 26,
    },
    sectionTitle: {
        width: "100%",
        fontSize: 23,
        fontWeight: "bold",
        color: "#172033",
        marginBottom: 14,
    },
    card: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#DCE4F0",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: "bold",
        color: "#2563EB",
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 15,
        lineHeight: 23,
        color: "#475569",
    },
    button: {
        width: "100%",
        backgroundColor: "#2563EB",
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 12,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    secondaryButton: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2563EB",
    },
    secondaryButtonText: {
        color: "#2563EB",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
