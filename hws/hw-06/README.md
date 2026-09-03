
# Todo App

Мобільний застосунок для керування списком справ, створений на **React Native + Expo + Expo Router + Convex**.

Проєкт налаштований для трьох середовищ:

* 🛠️ **Development** — локальна розробка;
* 🚀 **Preview** — автономне тестування;
* 🌟 **Production** — релізна збірка.

## Технології

* React Native
* Expo SDK 54
* Expo Router
* TypeScript
* Convex
* EAS Build
* EAS Update

---

## Середовища

Конфігурація застосунку знаходиться в `app.config.ts` та динамічно змінюється залежно від `APP_ENV`.

| Environment | Назва              | Android Package               | iOS Bundle ID                 | Scheme           |
| ----------- | ------------------ | ----------------------------- | ----------------------------- | ---------------- |
| Development | `Todo App Dev`     | `com.musdev13.rntodo.dev`     | `com.musdev13.rntodo.dev`     | `rntodo-dev`     |
| Preview     | `Todo App Preview` | `com.musdev13.rntodo.preview` | `com.musdev13.rntodo.preview` | `rntodo-preview` |
| Production  | `Todo App`         | `com.musdev13.rntodo`         | `com.musdev13.rntodo`         | `rntodo`         |

Завдяки різним Package Name та Bundle ID усі три версії можуть бути встановлені на одному пристрої одночасно.

---

## Іконки

Для кожного середовища використовуються окремі іконки:

```text
assets/images/
├── icon.png
├── android-icon-foreground.png
├── android-icon-background.png
├── android-icon-monochrome.png
└── icons/
    ├── icon-dev.png
    ├── android-icon-foreground-dev.png
    ├── icon-preview.png
    └── android-icon-foreground-preview.png
```

* `icon.png` — Production;
* `icon-dev.png` — Development з позначкою `DEV`;
* `icon-preview.png` — Preview з позначкою `PREVIEW`.

---

# EAS

Expo project:

`@musdev13/rn-todo`

EAS Project ID:

```text
ee9c4d87-08dc-4ade-9e0c-a95d36681cc9
```

## eas.json

Проєкт містить три профілі EAS Build:

### Development

```json
{
  "developmentClient": true,
  "distribution": "internal",
  "environment": "development",
  "channel": "development"
}
```

Збірка:

```bash
eas build --platform android --profile development
```

### Preview

```json
{
  "distribution": "internal",
  "environment": "preview",
  "channel": "preview"
}
```

Збірка:

```bash
eas build --platform android --profile preview
```

### Production

```json
{
  "autoIncrement": true,
  "environment": "production",
  "channel": "production"
}
```

Збірка:

```bash
eas build --platform android --profile production
```

---

# Preview Build

Preview APK була успішно зібрана та встановлена на Android-пристрій.

| Параметр        | Значення   |
| --------------- | ---------- |
| Platform        | Android    |
| Profile         | `preview`  |
| Status          | `finished` |
| Distribution    | `internal` |
| Channel         | `preview`  |
| SDK             | `54.0.0`   |
| Runtime Version | `1.0.0`    |
| Version         | `1.0.0`    |
| Version Code    | `1`        |

### Build

https://expo.dev/accounts/musdev13/projects/rn-todo/builds/18138b27-9be1-4019-86db-0b5ef182cee2

### APK

https://expo.dev/artifacts/eas/oZhL6EAOubzNmmDXVF7GSHJOI1f-akK2fBWJUSlZ2MU.apk

Preview-збірка є автономною та не потребує запущеного Metro Bundler.

---

# Production Build

Production Android AAB була успішно створена.

| Параметр        | Значення     |
| --------------- | ------------ |
| Platform        | Android      |
| Profile         | `production` |
| Status          | `finished`   |
| Distribution    | `store`      |
| Channel         | `production` |
| SDK             | `54.0.0`     |
| Runtime Version | `1.0.0`      |
| Version         | `1.0.0`      |
| Version Code    | `2`          |

### Build

https://expo.dev/accounts/musdev13/projects/rn-todo/builds/be6068c7-9595-404e-af77-b8dd52f23dc8

### AAB

https://expo.dev/artifacts/eas/z7SwMO5nYZnJxjhbYw7-5u_suPWUCzmu-5VYT0Auksk.aab

AAB призначений для подальшої публікації в Google Play.

---

# EAS Environment Variables

Для кожного середовища налаштовані окремі змінні оточення.

## Development

```text
APP_ENV=development
CONVEX_DEPLOYMENT=dev:utmost-wildcat-865
EXPO_PUBLIC_CONVEX_URL=https://utmost-wildcat-865.eu-west-1.convex.cloud
```

## Preview

```text
APP_ENV=preview
CONVEX_DEPLOYMENT=dev:utmost-wildcat-865
EXPO_PUBLIC_CONVEX_URL=https://utmost-wildcat-865.eu-west-1.convex.cloud
```

## Production

```text
APP_ENV=production
CONVEX_DEPLOYMENT=mus:mus-todo:production
EXPO_PUBLIC_CONVEX_URL=https://hardy-trout-54.convex.cloud
```

Production використовує окремий Convex deployment.

---

# Convex

Серверна частина застосунку знаходиться в директорії:

```text
convex/
├── schema.ts
└── todos.ts
```

Production deployment виконано командою:

```bash
npx convex deploy
```

Production deployment:

```text
mus:mus-todo:production
```

Production URL:

```text
https://hardy-trout-54.convex.cloud
```

Під час деплою:

* виконано валідацію схеми;
* згенеровано TypeScript bindings;
* успішно завантажено серверні функції;
* додано індекс `todos.by_completion`.

---

# EAS Update / OTA

Для бездротового оновлення JavaScript-коду використовується EAS Update.

Preview використовує:

```text
channel: preview
runtimeVersion: 1.0.0
```

OTA-оновлення було опубліковано командою:

```bash
eas update \
  --platform all \
  --environment preview \
  --channel preview \
  --message "UI: змінено колір"
```

Update group:

```text
582656df-45e4-ec2-afb9-00e4829cea3d
```

Після публікації оновлення застосунок був повторно відкритий без перевстановлення APK.

**Результат:** зміна кольору інтерфейсу була доставлена через OTA та успішно застосована.

OTA оновлює JavaScript та assets без повторної компіляції нативної частини застосунку.

---

# Основні команди

### Локальна розробка

```bash
npx convex dev
npx expo start -c
```

### Development Build

```bash
eas build --platform android --profile development
```

### Preview Build

```bash
eas build --platform android --profile preview
```

### Production Build

```bash
eas build --platform android --profile production
```

### OTA Update

```bash
eas update \
  --platform all \
  --environment preview \
  --channel preview \
  --message "UI: оновлення"
```

### Convex Production

```bash
npx convex deploy
```

### EAS Environment Variables

```bash
eas env:list --environment development
eas env:list --environment preview
eas env:list --environment production
```

### Список збірок

```bash
eas build:list --limit 10
```

---

# Структура проєкту

```text
rn-todo/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── stats.tsx
│   │   └── settings.tsx
│   └── _layout.tsx
├── assets/
│   └── images/
│       ├── icon.png
│       ├── android-icon-foreground.png
│       ├── android-icon-background.png
│       ├── android-icon-monochrome.png
│       ├── splash-icon.png
│       └── icons/
├── components/
├── context/
├── convex/
├── types/
├── app.config.ts
├── eas.json
├── package.json
└── tsconfig.json
```

---

# Виконані вимоги

* [x] Ініціалізовано та підключено EAS Project.
* [x] Створено динамічний `app.config.ts`.
* [x] Реалізовано Development / Preview / Production environments.
* [x] Реалізовано унікальні Android Package Name.
* [x] Реалізовано унікальні iOS Bundle ID.
* [x] Реалізовано окремі Deep Link schemes.
* [x] Створено окремі DEV та PREVIEW іконки.
* [x] Налаштовано EAS Environment Variables.
* [x] Налаштовано `eas.json`.
* [x] Створено автономну Preview APK.
* [x] Перевірено роботу Preview без Metro Bundler.
* [x] Створено Production Android AAB.
* [x] Опубліковано OTA-оновлення через EAS Update.
* [x] Перевірено застосування OTA без перевстановлення APK.
* [x] Виконано Production deployment Convex.
