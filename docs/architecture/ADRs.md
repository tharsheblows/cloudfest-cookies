# Architecture Decision Records (ADRs)


## Architecture Decision Log (ADL)
### ADR-1: Hackathon Scope
* Status: accepted
* Deciders: Hackathon Team
* Date: 2023-02-18 13:15

Technical Story: none

#### Context
There are multiple ways to create awareness for the upcoming changes for 3rd party cookies caused by the EU ePrivacy Directive 2022.
We have to decide on a way that is achievable during the Cloudfest Hackathon and providing value for technical and non-technical users.

#### Considered Options
* Browser Plugin
* Library
* CLI

#### Decision
Implementation of a browser plugin for Google Chrome.

#### Consequences
First increment will use the Google Chrome API.
This allows for a fast MVP, but makes the solution platform specific. 
  

#### Notes / Links
* [Chrome Extensions 101]( https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/ )


---

## Template

### ADR-[no]: short title
* Status: [proposed | rejected | accepted | deprecated | … | superseded by ADR-0005]
* Deciders: [list everyone involved in the decision]
* Date: [YYYY-MM-DD when the decision was last updated]

Technical Story: [description | ticket/issue URL]

#### Context
What is the issue that we're seeing that is motivating this decision or change?

#### Considered Options
* [option 1]
* [option 2]
* [option 3]

#### Decision
What is the change that we're proposing and/or doing?

#### Consequences
What becomes easier or more difficult to do because of this change?

#### Notes / Links
Important documents or articles that supplemented the decision process.
