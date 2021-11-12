Pass: K1m\_\_\_
ssh phkim@165.22.246.155
cd app/
cd test-test-code/
git pull origin main
npm i
cd client/
npm run build
cd ..
cd ..
pm2 restart ecosystem.config.js
cd ..

cd app/
cd test-code/
git pull origin main
npm i
cd client/
npm run build
cd ..
cd ..
pm2 restart ecosystem.config.js
cd ..
