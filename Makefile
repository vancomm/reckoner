install:
	npm ci

run:
	./bin/reckoner.js

publish:
	npm publish

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

git-add:
	git add . && git status