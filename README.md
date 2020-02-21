
# EECS 4481 Chat App Project

# Requirements
```
node v13.6.0
npm v6.13.4
```

# Running locally
Install dependencies
```
npm install
```

Create `.env` file containing:
```
admin=<DB password>
secret=<Auth secret>
```
Replacing `<...>` as neccessary

Run development server
```
npm run-script dev
```
Accessbile from `http://localhost:3000/`

Build Production Files
```
npm build
```
