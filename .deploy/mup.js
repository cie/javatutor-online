module.exports = {
  servers: {
    one: {
      host: 'javatutor.tk',
      username: 'root',
      pem: '~/.ssh/id_rsa_javatutor'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    name: 'javatutor',
    path: '../',
    volumes: {
      '/var/run/docker.sock': '/var/run/docker.sock',
      '/opt/org.eclipse.jdt.ls': '/opt/org.eclipse.jdt.ls'
    },

    servers: {
      one: {}
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      ROOT_URL: 'http://javatutor.tk',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local'
    },

    docker: {
      // abernix/meteord:node-12-base works with Meteor 1.9 - 1.10
      // If you are using a different version of Meteor,
      // refer to the docs for the correct image to use.
      image: 'pontosan3/javatutor-meteor',
      buildInstructions: [
        // install Java 11
        /*`RUN echo 'deb http://deb.debian.org/debian stretch-backports main' >> /etc/apt/sources.list && 
         apt-get update &&
         apt-get install -y openjdk-11-jdk-headless &&
         apt-get clean`*/
        // install Java 8
        //'RUN apt-get update && apt-get install -y openjdk-8-jdk'
      ]
    },
    deployCheckWaitTime: 300,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
}
