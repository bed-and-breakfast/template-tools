[![NPM Version](https://img.shields.io/npm/v/@bed-and-breakfast/template-tools)](https://www.npmjs.com/package/@bed-and-breakfast/template-tools)
[![CI](https://github.com/bed-and-breakfast/template-tools/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bed-and-breakfast/template-tools/actions/workflows/ci.yml)
[![Release](https://github.com/bed-and-breakfast/template-tools/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/bed-and-breakfast/template-tools/actions/workflows/release.yml)
[![Code Climate](https://codeclimate.com/github/bed-and-breakfast/template-tools/badges/gpa.svg)](https://codeclimate.com/github/bed-and-breakfast/template-tools)
[![Code Coverage](https://codeclimate.com/github/bed-and-breakfast/template-tools/badges/coverage.svg)](https://codeclimate.com/github/bed-and-breakfast/template-tools)
[![Known Vulnerabilities](https://snyk.io/test/github/bed-and-breakfast/template-tools/badge.svg?targetFile=package.json)](https://snyk.io/test/github/bed-and-breakfast/template-tools?targetFile=package.json)

# Bed & Breakfast Template Tools

Tools to aid in the management of repositories based on @bed-and-breakfast/template-\*.

# Installation

After creating a new repository from [@bed-and-breakfast/template-open-source](https://github.com/bed-and-breakfast/templates-open-source), it can be initiated with the following command:

```sh
npm i -D @bed-and-breakfast/template-tools
```

# Tools

Template tools are available in the form of the following CLI commands

## template-init

After a repository has been created from the [@bed-and-breakfast/template-open-source](https://github.com/bed-and-breakfast/templates-open-source) template it needs to be initialized. Run the following command to do this and follow the instructions on the screen.

```sh
npx template-init
```

> **Note**
> The default behavior is to automatically commit and push the changes to git, this can be prevented.

## template-add-remote

Adds a read-only remote to the [@bed-and-breakfast/template-open-source](https://github.com/bed-and-breakfast/templates-open-source) template from which we can pull the latest changes.

```sh
npx template-add-remote
```

## template-pull

Bed & Breakfast repository templates will be updated over time. Start by setting up a remote with the template-add-remote command. You can then use the following command to pull these changes into an existing repository:

```sh
npx template-pull
```

> **Note**
> Be careful resolving conflicts when pulling from a template. Files like package.json, README.md, CHANGELOG.md etc. will have changes you don't want to accept.
