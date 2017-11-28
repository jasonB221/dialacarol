cd proxy/
cp -r * /var/www/dialacarol/public_html/
cd ../backend/
sed -e "s/shared_key/$SHAREDKEY/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/maps_api_key/$MAPSKEY/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/username/$DBUSER/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/password/$DBPASS/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/latlng_table_name/$TABLENAME/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
sed -e "s/firebase_messaging_token/$FCMTOKEN/g" settings.php > settings.php.tmp && mv settings.php.tmp settings.php
cd ../google/
sed -e "s/shared_key/$SHAREDKEY/g" "Form Submission.gs" > tmp && mv tmp "Form Submission.gs"