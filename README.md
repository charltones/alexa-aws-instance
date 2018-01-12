# alexa-aws-instance
Manipulate an AWS EC2 instance using Amazon Alexa. You can use this skill to control a named EC2 instance in your AWS account - start, stop, check status and find the public IP and ask how long it has been up for.
### Pre-requisites

* Node.js (> v4.3)
* Register for an [AWS Account](https://aws.amazon.com/)
* Register for an [Amazon Developer Account](https://developer.amazon.com/)
* Install and Setup [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html)

### Installation
1. Clone the repository.

	```bash
	$ git clone https://github.com/charltones/alexa-aws-instance.git
	```

2. Initialize the [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) by Navigating into the repository and running npm command: `ask init`. Follow the prompts.

	```bash
	$ cd skill-sample-nodejs-howto
	$ ask init
	```

3. Install npm dependencies by navigating into the `/lambda/custom` directory and running the npm command: `npm install`

	```bash
	$ cd lambda/custom
	$ npm install
	```


### Deployment

ASK CLI will create the skill and the lambda function for you. The Lambda function will be created in ```us-east-1 (Northern Virginia)``` by default.

1. Deploy the skill and the lambda function in one step by running the following command:

	```bash
	$ ask deploy
	```

2. Amend the role used for the Lambda function in the AWS management console to allow it access to EC2. This will let it call describe instances, stop instances and start instances.

### Usage
Once the skill is deployed, you can test it from the command line or via the Alexa skills page [here](https://developer.amazon.com/edw/home.html#/skills). After testing, you can use it with your own Alexa devices, just say:

	```
	ask my instance is {name} running
	```

Currently this will search EC2 instances in the eu-west-1 region only, looking for instances which match the Name tag with the name specified. It tries to match name against a first name (specified in the en-GB.json file as AMAZON.GB_FIRST_NAME). You can change the code to match other sets of strings according to the slot type reference [here](https://developer.amazon.com/docs/custom-skills/slot-type-reference.html).