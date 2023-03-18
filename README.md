# Cookie Analysis Tool


### Table of contents

<!--ts-->
* [Purpose](#purpose)
* [Ideas](#ideas)
* [Future Improvements](#future-improvements)
* [Documentation](#documentation)
  * [Sketches](#sketches)
  * [Development modules](#development-modules)
  * [White box view](#whitebox-view)
  * [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)
* [Cloudfest Hackathon](#cloudfest-hackathon)
* [Development](#development)
  * [How to run the project?](#running-the-project)
* [Glossary](#glossary)
<!--te-->

## Purpose
Many websites rely on the usage of 3rd party cookies. By mid 2024, all 3rd party cookies will be blocked in most browsers, including Google Chrome (e.g. Safari is already blocking those cookies).
With this browser extension we want to give the opportunity to evaluate a webpage for relying on 3rd party cookies.

## Ideas
- TBD

## Future Improvements
- TBD

## Documentation
### Sketches

![Sketch](docs/images/workflow_drawing.jpg)

## Development modules

First sketch of the approach of cutting the project into modules.

![Modules](docs/architecture/charts/modules.svg)

## Whitebox view

![Whitebox](docs/architecture/charts/whitebox_view.svg)

## Architecture Decision Records (ADRs)

Find the ADRs [here](docs/architecture/ADRs.md).

### Cloudfest Hackathon
This Extension was developed during the [Cloudfest Hackathon 2023](https://www.cloudfest.com/hackathon). 

## Development

### Running the project

```shell
npm run watch
```
Afterwards add the `build` folder in your chrome extensions (after enabling developer mode). 

# Glossary
