# Protein Function Classifier

## First please check Docker installed on your PC
For windows users:
Please first install [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) if not.

## Download weight files
1. download [a weight file](https://sunmoonackr-my.sharepoint.com/:u:/g/personal/seiyau77_sunmoon_ac_kr/EUUurwVwkqBMlSvSWTX0AhIBXyVHFVCFU13oAA5XjXYqHw?e=9kaJN6)
1. Save the file above into `ecami_app/api/model`

## Running

1. `docker-compose up --build -d`
1. `bash django_setup.sh`
1. There should now be two servers running:
  - [http://127.0.0.1:8000](http://127.0.0.1:8000) is the Django app
  - [http://127.0.0.1:3000](http://127.0.0.1:3000) is the React app
  - [http://127.0.0.1:5432](http://127.0.0.1:5432) is the PostgreSQL Database

## Checking working containers
  - `docker-compose ps`

## Closing
  - `docker-compose down -v`
