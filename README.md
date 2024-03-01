Local environment setup 
1. Go through https://facebook.github.io/react-native/docs/getting-started
2. Clear your local cache and install needed Packages: rm -rf node_modules/ && yarn cache clean && yarn install . Install yarn if not installed. 
3. Run on android devices - react-native run-android

Code Checking process - 
1. Create a dev branch from develop branch. 
2. Checkout into your new branch
3. Once code done and tested. Run below command to push it to qa branch - run command - sh git_checkin_process_qa.sh devBranchName
4. Once qa tested you can use below command to push the code to develop branch and raise a merge request. run command - sh git_checkin_process_prod.sh


