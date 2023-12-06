<h1>Arms-tracker App</h1>

This repository is part of the arms-tracker app, an interactive web-application visualising the flow of arms ex- and imports and the impact on global conflict.

You can visit the app at <a href=https://www.arms-tracker.app>www.arms-tracker.app</a>

For a full documentation please go to <a href=https://github.com/Kafkaese/taro> this repository </a>, which serves as a landing page and gives a better overview of the entire project. Below you can find the section of the documentation that refers to this repository in particular.
This repository contains the frontend of the arms-tracker app. 

<h2>Frontend Code</h2>
This repository contains the frontend of the arms-tracker app. 

<h4>React.js Application</h4>
The frontend was written in javascript using the <a href=https://react.dev/>React Frameworl</a>. It is containerized with Docker and served by an <a href=https://nginx.org/en/>Nginx<a> web server.</a>

<h4>Continious Integration</h4>
Similarily to the backend repository, the frontend repository also contains some elements of the CI pipeline. Again, a Test Workflow, using Github Actions, is run every time a non-draft pull-request into the main branch of the taro-map respository is opened or synchronized.
The workflow uses <a href=https://www.terraform.io/>Terraform</a> to provision a Test Environment on <a href=https://www.terraform.io/>Microsoft Azure</a>, which includes:
<br></br> 

After the environment has been provisioned, the image for the frontend is build and pushed to the container registry. Then the Container Group starts an instance of the Frontend image and the tests can be run. In a final step, no matter what the outcome of any previous steps, the Test Environment is destroyed.

