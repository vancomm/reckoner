install:
	npm ci

run:
	./bin/reckoner.js

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8	

test-watch:
	npx jest --watch

publish:
	npm publish --dry-run

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

git-add:
	git add . && git status