sudo docker container remove -f bana-front

git pull

sudo docker build . -t bana-front

sudo docker run -d --rm -p 3030:3030 --name bana-front bana-front