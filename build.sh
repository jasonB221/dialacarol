#Handle frontend deployment
#Clean previous build directory
rm -rf ./build
mkdir ./build
cd web/
#Copy web files over to local server
cp -r * /var/www/dialacarol/public_html/
#Copy web files to deployment server
cp -r * ../build/
cd ../build/
#Delete Javascript files
rm -rf js
rm *.js
#Minify JS files
cd ../web/
uglifyjs ./js/*.js --compress --output ../build/dialacarol.min.js
uglifyjs firebase-messaging-sw.js --compress --output firebase-messaging-sw.js
#Copy JS back over to local server
cd ../build/
cp dialacarol.min.js /var/www/dialacarol/public_html/dialacarol.min.js
rm /var/www/dialacarol/public_html/firebase-messaging-sw.js
cp firebase-messaging-sw.js /var/www/dialacarol/public_html/firebase-messaging-sw.js

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