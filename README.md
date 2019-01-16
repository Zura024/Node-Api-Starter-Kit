
## Installation

1. Clone the project
2. Go to the project directory and run `npm install`
3. Create database
4. Copy `config/config.dist.json` into `config/config.json` and configure with correct parameters
5. Run migrations by executing `npm run migrate`
6. Start the project by running `npm run start` and the project will be started at port 4000




###Creating new user

You can create new user by running a console script from the root directory of the project
```bash
npm run add-user -- -u USERNAME -p PASSWORD
```

### Run application

You can run application in background by running following command

```bash
nohup node app.js &
```
