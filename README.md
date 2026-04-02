# Тоқжан — Қыз ұзату тойына шақыруы

Свадебное онлайн-приглашение на Next.js с записью RSVP в Google Sheets.

## Быстрый старт

```bash
npm install
npm run dev
```

Откроется на [http://localhost:3000](http://localhost:3000).

## Настройка Google Sheets

### 1. Создайте Google Spreadsheet

- Перейдите на [Google Sheets](https://sheets.google.com) и создайте новую таблицу
- Скопируйте **ID таблицы** из URL — это часть между `/d/` и `/edit`:
  ```
  https://docs.google.com/spreadsheets/d/ЭТОТ_ID_СКОПИРОВАТЬ/edit
  ```

### 2. Создайте Google Apps Script

- Перейдите на [Google Apps Script](https://script.google.com)
- Создайте новый проект
- Вставьте содержимое файла `google-apps-script.js`
- Замените `YOUR_GOOGLE_SPREADSHEET_ID` на ID вашей таблицы

### 3. Опубликуйте как Web App

- В меню: **Deploy → New deployment**
- Тип: **Web app**
- Execute as: **Me**
- Who has access: **Anyone**
- Нажмите **Deploy**
- Скопируйте полученный URL

### 4. Подключите к сайту

Откройте `lib/constants.ts` и замените:

```typescript
export const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";
```

на скопированный URL из шага 3.

## Деплой на Vercel

```bash
npm install -g vercel
vercel
```

Или подключите GitHub-репозиторий на [vercel.com](https://vercel.com).

## Структура проекта

```
app/
  layout.tsx        — root layout, шрифты, metadata
  page.tsx          — главная страница
  globals.css       — цвета и стили

components/
  Hero.tsx          — заглавная секция с именами
  Invitation.tsx    — текст приглашения
  Countdown.tsx     — обратный отсчёт
  EventDetails.tsx  — дата, время, место, карта
  RsvpForm.tsx      — RSVP форма
  Footer.tsx        — завершающий блок

lib/
  constants.ts      — все тексты и данные
```

## Технологии

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Apps Script](https://developers.google.com/apps-script) + Google Sheets
