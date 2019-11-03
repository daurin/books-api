# Backend Test de Daurin Lora Mejia

## Descripción
> Esta es una api restul escrita en nodejs donde podras crear usuarios, crear libros y por medios de los usuarios creados calificar los libros por medio de votaciones -1 y +1.

## Requisitos del proyecto

- Node
- Postman o un cliente para hacer las peticiones a la api rest
- mysql para que la api puedea conectarse a la base de datos

## Como configurar el proyecto
1. Abrimos el arhivo ubicado en `src/config/env.json` y asignamos los datos de acuerdo a la pc en la cual esta instalada
2. Ejecutamos el comando `npm install knex -g` que installa la libreria knex globalmente en node necesaria para los migrations y seeds.
3. Ejecutamos el comando  `npm install` que instala todos los paquetes que usa el proyecto
4. Ejecutamos el comando  `npm run dbinit` que crea la base de datos e inserta datos para poder testear la api

## Como usar

La api consta de una serie de rutas para realizar las funciones que pide la prueba de backend test.
las rutas son las siguientes:

| Ruta | Metodo | Descripción |
| ---- | ------ | ----------- |
| `/users` | POST | Crea un nuevo usuario con los campos: (name) |
| `/books` | POST | Crea la ficha de un libro con los campos: (id_user, title, description, publication_date, author) |
| `/books/:id/ratings` | POST | Esta es la forma de hacer las votaciones, campos: (id_user, vote, commentary) |
| `/books/:id` | GET |Trae un libro especifico por medio del id |
| `/books` | GET | Trae todos los libros de forma paginada y en el orden de publicacion descendente. Params url: (text_search, offset, limit) |

Ejecuta el siguiente comando para inicar la app:
`npm start`