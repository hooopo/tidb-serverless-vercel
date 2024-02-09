
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

### clone codebase

```
git clone https://github.com/hooopo/tidb-serverless-vercel.git
```
and 

```
cd tidb-serverless-vercel
```

### Link to vercel

```
vercel link
```

> Vercel CLI 31.0.4
> ? Set up “~/hooopo/tttttt”? [Y/n] y
> 
> ? Which scope should contain your project? hooopo
> 
> ? Link to existing project? [y/N] n
> 
> ? What’s your project’s name? hello
> 
> ? In which directory is your code located? ./

### Setup env

```
vercel env add DATABASE_URL
```

### Deploy to production

```
vercel --prod
```
