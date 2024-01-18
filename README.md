
## Dev

setup .env file

```
DATABASE_URL=mysql://user:pass@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test
```

```
npm install
npm run start

```

## Prod

```
vercel env add DATABASE_URL
vercel --prod
```
