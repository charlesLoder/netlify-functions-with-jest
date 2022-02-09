# Testing Netlify TypeScript Functions

This is a repo for testing Netlify TypeScript functions locally with Jest.

## Packages

Run

```bash
npm install
```

to install all dependencies.

To check for updates, run:

```
npm run update
```

and follow the prompts.

Or you can install the necessary dependencies just for testing and ingnore the rest.

### Necessary

```bash
npm i -D netlify-cli @netlify/functions typescript jest @types/jest lambda-tester @types/lambda-tester ts-jest
```

### Not Necessary

These are just for mock easy api calls.

``bash
npm i node-fetch @types/node-fetch

```

## Resources

- https://www.jeffreyknox.dev/blog/jest-tests-for-netlify-functions/
- https://answers.netlify.com/t/testing-lambda-functions/6263
```
