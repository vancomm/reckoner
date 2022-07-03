install:
	npm ci

build:
	npx tsc

run: 
	./bin/reckoner.js

start: build run

publish:
	npm publish --dry-run

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

git-add:
	git add . && git status