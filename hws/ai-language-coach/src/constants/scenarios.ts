import { RoleplayScenario } from "@/types";

export const SCENARIOS: RoleplayScenario[] = [
  {
    id: "coffee-smalltalk",
    title: "Coffee Break Small Talk",
    subtitle: "Невимушена розмова на кухні",
    icon: "☕",
    partnerRole: "Alex, Senior Developer from London",
    description:
      "Ви зустріли іноземного колегу біля кавомашини. Обговоріть плани на вихідні, погоду та хобі.",
    initialPromptHint:
      "Start by greeting your colleague casually by the coffee machine.",
    levelRecommendations: {
      A2: "Використовуйте прості часи Present Simple та розкажіть про улюблену каву чи погоду.",
      B1: "Обговоріть плани на вечір або недавні фільми, ставте зустрічні запитання.",
      B2: "Використовуйте ідіоми, жарти та розповідайте розгорнуті життєві історії.",
    },
  },
  {
    id: "daily-standup",
    title: "Daily Scrum Standup",
    subtitle: "Ранкова синхронізація команди",
    icon: "💼",
    partnerRole: "Sarah, Scrum Master",
    description:
      "Черга вашого виступу на 15-хвилинному мітингу. Розкажіть про вчорашній прогрес, плани та блокери.",
    initialPromptHint: "Say hello to the team and give your daily update.",
    levelRecommendations: {
      A2: "Чітка формула: 'Yesterday I worked on... Today I plan to... No blockers.'",
      B1: "Поясніть причину затримки задачі та домовтеся про парне програмування.",
      B2: "Лаконічний бізнес-звіт з IT-термінологією (PR review, merge conflicts, staging deployment).",
    },
  },
  {
    id: "client-demo",
    title: "Client Demo & Feedback",
    subtitle: "Демонстрація фічі замовнику",
    icon: "🤝",
    partnerRole: "Michael, Product Owner from California",
    description:
      "Ви показуєте нову реалізовану функцію клієнту. Відповідайте на питання та реагуйте на зауваження.",
    initialPromptHint:
      "Welcome the client and introduce the feature you will demonstrate.",
    levelRecommendations: {
      A2: "Опишіть, як працює екран: 'Here user clicks button and sees profile.'",
      B1: "Аргументуйте технічне рішення та ввічливо погодьтеся на доопрацювання.",
      B2: "Професійне обговорення компромісів (Trade-offs, performance, user experience).",
    },
  },
  {
    id: "airport-check",
    title: "Airport Customs & Border",
    subtitle: "Паспортний контроль та митниця",
    icon: "✈️",
    partnerRole: "Officer Davis, Border Control Officer",
    description:
      "Ви прилетіли на міжнародну IT-конференцію в США чи Великобританію. Відповідайте на запитання офіцера.",
    initialPromptHint: "Hand over your passport and greet the officer politely.",
    levelRecommendations: {
      A2: "Відповідайте чітко на питання про мету візиту: 'I am here for a conference.'",
      B1: "Назвіть адресу готелю, тривалість поїздки та посаду у компанії.",
      B2: "Вільне порозуміння за будь-яких додаткових уточнень про багаж чи квитки назад.",
    },
  },
];