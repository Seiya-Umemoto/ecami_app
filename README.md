# Protein Function Classifier

## First please check Docker installed on your PC
For Windows User:
Please first install [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) if not.

## Running

1. `docker-compose up --build -d`
1. There should now be two servers running:
  - [http://127.0.0.1:5000](http://127.0.0.1:8000) is the Django app
  - [http://127.0.0.1:3000](http://127.0.0.1:3000) is the React app
  - [http://127.0.0.1:3000](http://127.0.0.1:5432) is the PostgreSQL

## Closing
  - `docker-compose down -v`
