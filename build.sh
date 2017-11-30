#Handle frontend deployment
#Clean previous build directory
rm -rf ./build
mkdir ./build
#Copy web files to deployment server
cd web/
cp -r * ../build/
cd ../build/
#Delete Javascript files
rm -rf js
rm firebase-messaging-sw.js
#Delete CSS files
rm -rf css
#Minify all the files
cd ../web/
uglifyjs ./js/*.js --compress --output ../build/dialacarol.min.js
uglifyjs firebase-messaging-sw.js --compress --output ../build/firebase-messaging-sw.js
html-minifier --collapse-whitespace --quote-value \' --remove-comments --remove-tag-whitespace --minify-js inline --output ../build/index.html index.html
html-minifier --collapse-whitespace --quote-value \' --remove-comments --remove-tag-whitespace --minify-js inline --output ../build/404.html 404.html
cleancss -O2 --output ../build/style.min.css ./css/*.css
#Copy files to local server
cd ../build/
cp -r ./* /var/www/dialacarol/public_html/
#Deploy to cloud hosting
firebase deploy --token "$DEPLOY_TOKEN" --project "$FIREBASE_PROJECT_ID" --only hosting

#Handle function deployment
cd ../functions/
npm install
firebase deploy --token "$DEPLOY_TOKEN" --project "$FIREBASE_PROJECT_ID" --only functions

#Take care of backend variable replacement
cd ../backend/
sed -e "s/shared_key/$SHAREDKEY/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/maps_api_key/$MAPSKEY/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/username/$DBUSER/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/password/$DBPASS/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/latlng_table_name/$TABLENAME/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/firebase_messaging_token/$FCMTOKEN/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
cd ../google/
sed -e "s/shared_key/$SHAREDKEY/g" "Form Submission.gs" > tmp && mv tmp "Form Submission.gs"