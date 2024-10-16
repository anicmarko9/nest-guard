# Pull Request Checklist

Please ensure you have completed the following:

- [ ] No `.env` variable has been pushed.
- [ ] All `console.log()` statements are removed.
- [ ] The `package-lock.json` file is not edited (unless new `npm` package has been installed).
- [ ] The `yarn.lock` is not pushed by accident.
- [ ] Added path aliases in these files: `tsconfig.paths.json`, `package.json`, `jest-e2e.json` (if new module has been implemented).
- [ ] Added SQL migrations (`npm run typeorm:generate-migration --name=AddPhoneNumber`) (if the database entity has been updated).
