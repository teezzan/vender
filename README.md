# Vender

## The Ultimate API based Vending Machine.
![Logo](./images/leaguey.png)

>**Vender** allows you to do the following

- [x] Sign up as a Buyer or Seller.
- [x] Ability to Deposit Coins for purchase.
- [x] Ability to "Upload" and Restock products.
- [x] Store PDF for up to two days in the cloud.

**Note**: **I have a deployed version of the aplication found [here on Heroku](https://leaguey.herokuapp.com/swagger-html)**


## Built With

- [Nodejs](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [ExpressJS](https://expressjs.com/)
- [TypeORM](https://www.mongodb.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Getting Started
This application can be deployed locally by the following ways.
<!-- - Using `docker-compose` -->
- Using `Docker`
- Using the local environment.

### Prerequisites
If you are considering the first two options of deployment, you would need to have a local installation of MySQL.


### Docker
To run the application with docker, you need a local installation of MySQL and the `POSTGRES_DB` already created. After satisfying the requirement, run the following to build the image. **Note**: `POSTGRES_DB` will not be created automatically and would need to be manually created.
```bash
docker build --pull --rm -f "Dockerfile" -t leaguey:latest "."
```
and this to run the image.
```bash
docker run --rm -it \
    --network="host" \
    -e NODE_ENV=prod \
    -e POSTGRES_PASSWORD='newPassword' \
    -e POSTGRES_USER='postgres' \
    -e POSTGRES_DB='slot' \
    -e PG_PORT=5432 \
    -e PG_HOST='localhost' \
    -e JWT_SECRET='jwt'
    -e JWT_EXPIRATION='50m'
    -p 4000:4000/tcp \
    vender:latest

```
You can also pull the image from DockerHub with:
```bash
docker run --rm -it \
    --network="host" \
    -e NODE_ENV='production' \
    -e POSTGRES_PASSWORD='newPassword' \
    -e POSTGRES_USER='postgres' \
    -e POSTGRES_DB='slot' \
    -e PG_PORT=5432 \
    -e PG_HOST='localhost' \
    -e JWT_SECRET='jwt'
    -e JWT_EXPIRATION='50m'
    -p 4000:4000/tcp \
    teezzan/vender:latest
```
### Local Environment

Foremost, you have to clone this repository and install all the dependencies with the following commands.
```bash
git clone https://github.com/teezzan/vender.git
cd vender
npm install

```
Rename the `.env.example` to `.env` and customize it to your local machines specifications.
**Note**: `POSTGRES_DB` will not be created automatically and would need to be manually created.

Run `npm run dev` to start the local server.


### NPM scripts

- `npm run test`: Run tests
- `npm run build`: Builds the Typescript code and deploy locally
- `npm run prettier`: Run prettier Lint.

## API Reference/Documentation
A  documentation can be found at `http://localhost:4000/`
## Authors

**[Taiwo Yusuf](https://github.com/teezzan/)**