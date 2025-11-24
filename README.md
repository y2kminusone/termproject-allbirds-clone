
---

# ✔️ **README.md (팀원용 설치·실행 가이드)**

```md
# Termproject Allbirds Clone

React(Vite) + Express + Prisma(SQLite) 기반의 텀프 프로젝트입니다.  
이 문서는 팀원이 로컬 환경에서 프론트/백엔드를 모두 실행할 수 있도록 안내합니다.

---

# 📁 프로젝트 구조

```

termproject-allbirds-clone/
├── backend/     # Express + Prisma + SQLite
└── frontend/    # React + Vite

````

---

# 🛠 필수 요구사항

- Node.js 20 이상 (24도 가능)
- npm 10 이상
- Git
- VSCode/WebStorm 등 IDE (선택)

---

# 🚀 1. 프로젝트 클론

```bash
git clone <레포주소>
cd termproject-allbirds-clone
````

---

# 🚀 2. 프론트엔드 설정 (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

### ➤ 실행 주소

[http://localhost:5173](http://localhost:5173)

---

# 🚀 3. 백엔드 설정 (Express + Prisma + SQLite)

## 3-1) 백엔드 폴더 이동

```bash
cd backend
```

## 3-2) 패키지 설치

```bash
npm install
```

## 3-3) 환경 변수 설정

`.env` 파일 생성:

```bash
DATABASE_URL="file:./mydb.sqlite"
PORT=3000
```

## 3-4) Prisma DB 마이그레이션

(이미 migration 폴더가 포함돼 있으므로 아래 한 줄만 실행하면 됩니다.)

```bash
npx prisma migrate deploy
```

### ⚠️ 만약 최초 세팅이라 schema 적용이 안 되어 있으면:

```bash
npx prisma migrate dev --name init
```

## 3-5) 백엔드 실행

```bash
npm run dev
```

### ➤ 실행 주소

[http://localhost:3000](http://localhost:3000)

---

# 🔗 4. API 테스트

### 헬스 체크

```
GET http://localhost:3000/health
```

---

# 📌 5. 주요 스택

* **Frontend:** React 18, Vite, JSX, CSS
* **Backend:** Node.js, Express, CORS, dotenv
* **Database:** SQLite
* **ORM:** Prisma 7.x

---

# 📂 6. 백엔드 파일 구조

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   └── index.js
├── mydb.sqlite
├── prisma.config.ts
└── .env
```

---

# 🧑‍🤝‍🧑 7. 팀원이 첫 실행 시 해야 할 일

1. 프로젝트 clone
2. frontend / backend 각각 npm install
3. backend에 `.env` 생성
4. prisma migrate 실행
5. frontend, backend 각각 `npm run dev`

---

# 📝 8. 추가 개발 규칙

* 브랜치는 기능 단위로 생성
* 백엔드 PR 올릴 때 prisma schema 변경 시 팀원에게 공유
* DB 스키마 변경되면 migrate dev 필수

---


