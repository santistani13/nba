🏀 NBA App – Fullstack Project

Aplicación fullstack desarrollada con Angular 21 + NestJS, autenticación JWT y base de datos PostgreSQL dockerizada usando Prisma como ORM.

🚀 Tech Stack
🖥 Frontend

Angular 21

Signals

Angular Router

Guards

Reactive Forms

🔐 Backend

NestJS

JWT Authentication

Bcrypt (hash de contraseñas)

Prisma ORM

🗄 Base de Datos

PostgreSQL 16

Docker

Prisma Migrations

🏗 Arquitectura del Proyecto
project-root/
│
├── frontend/              → Angular 21
│   ├── src/
│   └── package.json
│
├── backend/               → NestJS API
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   ├── .env
│   └── package.json
│
├── docker-compose.yml     → PostgreSQL container
└── README.md
🐳 Base de Datos (PostgreSQL Dockerizado)

La base de datos corre en un contenedor Docker.

Levantar PostgreSQL:
docker-compose up -d


Esto crea:

Usuario: postgres

Password: postgres

Base de datos: nba_app

Puerto: 5432

Para detener la base:

docker-compose down
🧬 Prisma (ORM)

Prisma gestiona el esquema y las migraciones de la base.

Ejecutar migraciones:

Desde la carpeta backend:

npx prisma migrate dev

Abrir Prisma Studio (UI para ver la DB):
npx prisma studio
▶️ Levantar el Proyecto Completo

Existe un comando único para correr frontend y backend juntos:
npm start

🔐 Autenticación

El sistema utiliza:

JWT

Guards en Angular

Validación de credenciales contra base de datos

Persistencia real en PostgreSQL

Usuario de prueba
Email: test@gmail.com
Password: test


💼 Objetivo del Proyecto

Proyecto desarrollado como práctica profesional fullstack utilizando arquitectura moderna, separación de responsabilidades y base de datos persistente dockerizada.
