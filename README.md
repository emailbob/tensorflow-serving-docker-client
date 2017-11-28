
# Tensorflow serving Node.js client

## Description
Simple nodejs client to send images to a Tensorflow serving server

### Docker Build

```bash
docker build -t tensorflow-serving-docker-client .
```

### Docker Run

Example for using a local image called turtle.jpg that is in your current path

```bash
docker run -ti -v $(pwd):/image tensorflow-serving-docker-client --host=<tensorflow servering host> --port=9000 --image=/image/turtle.jpg
```

Example for downloading a remote image from a url and deleting it afterward

```bash
docker run -ti tensorflow-serving-docker-client --host=<tensorflow servering host> --image=https://upload.wikimedia.org/wikipedia/commons/7/74/A-Cat.jpg -d
```

### Run from source

```bash
node . --host=<tensorflow servering host> --image=turtle.jpg
```


### Options
```
-h, --host          Tensorflow servering host

-p, --port          Tensorflow servering host port (default : 9000)

-i, --image         Image path

-v, --verbose       Shows extra output

-d, --delete        This will delete the image locally if you are providing the image form a url
```

